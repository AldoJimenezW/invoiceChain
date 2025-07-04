'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { usePathname, useRouter } from 'next/navigation'
import { Home, LogOut, User, Shield, Users, Search, IdCard } from 'lucide-react' // Added Search icon
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import { authClient, useSession } from '~/lib/auth'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data, refetch } = useSession() // Get update function from useSession

  const router = useRouter()
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(false) // Add loading state
  const [fadeState, setFadeState] = useState<'fade-in' | 'fade-out'>('fade-in')
  const [showContent, setShowContent] = useState(!!data)


  // Check user role on component mount
  useEffect(() => {
    if (data?.user?.isAdmin) {
      setIsAdmin(true)
    }
  }, [data])

  useEffect(() => {
    if (!!data !== showContent) {
      setFadeState('fade-out')
      const timeout = setTimeout(() => {
        setShowContent(!!data)
        setFadeState('fade-in')
      }, 250) // Duration matches CSS transition
      return () => clearTimeout(timeout)
    }
  }, [data, showContent])

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('Logged out successfully', {
            description: 'You have been successfully logged out.',
          })
          window.location.href = '/auth/signin'
        },
      },
    })
  }

  // Function to set user role
  const setRole = async (role: 'creator' | 'customer') => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/set-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      } else {
        console.log('Role updated successfully');
        // Refetch session data to update the UI based on the new role
        await refetch();
        // Navigate to the appropriate dashboard based on the role
        if (role === 'creator') {
          router.push('/dashboard/create-card');
        } else if (role === 'customer') {
          router.push('/dashboard');
        }
      }
    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }


  // Admin-only navigation items
  const adminNavItems = [
    { href: '/dashboard/users', label: 'Users', icon: Users },
    // Add more admin pages as needed
  ]

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(path)
  }

  // Fade wrapper styles
  // Place this style block at the top level of your file or in a global CSS file if preferred
  // <style jsx global> can be used if you want to keep it local
  // For this example, we use a style tag inside the component
  return (
    <>
      <style>
        {`
          .fade-in {
            opacity: 1;
            transition: opacity 250ms;
          }
          .fade-out {
            opacity: 0;
            transition: opacity 250ms;
          }
        `}
      </style>
      <div className="min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center bg-fixed">
        <div className={fadeState}>
          {!showContent ? (
            <div className='flex flex-col items-center justify-center h-screen'>
              <p className="text-white text-xl">Loading...</p>
            </div>
          ) : data?.user?.role !== null ? (
            <div className='flex flex-col'>
              <header className='border-b border-bg-blue-700 bg-black/20 backdrop-blur-md backdrop-blur-sm sticky top-0 z-10'>
                <div className='container mx-auto px-4 py-3 flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <Link href='/dashboard' className='flex items-center space-x-2'>
                      <Home className='h-8 w-8 text-[#09d4d5]' />
                      <div className="text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#09d4d5] via-[#f538ff] to-[#f538ff] animate-gradient-x bg-[length:200%_200%]">
                        inVoiceChain
                      </div>
                    </Link>
                  </div>
                  <div className='flex-1 flex justify-center px-4'>
                    <div className='relative w-full max-w-2xl bg-white rounded-md'>
                      <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500' />
                      <Input
                        type='text'
                        placeholder='Search...'
                        className='pl-10 pr-2 py-2 rounded-md border border-gray-300 focus:border-bg-blue-700 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-sm w-full' // Adjusted pl, py, and w-full
                      />
                    </div>
                  </div>

                  <nav className='hidden md:flex items-center space-x-6'>
                    {/* Admin section */}
                    {isAdmin && (
                      <>
                        <div className='h-6 border-l border-indigo-200'></div>
                        <div className='flex items-center'>
                          <Badge className='mr-2 bg-indigo-600'>Admin</Badge>
                          {adminNavItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`flex items-center space-x-1 ml-4 relative ${isActive(item.href)
                                ? 'text-blue-700 font-medium'
                                : 'text-gray-600 hover:text-blue-700'
                                }`}
                            >
                              <item.icon className='h-4 w-4' />
                              <span>{item.label}</span>
                              {isActive(item.href) && (
                                <div className='absolute h-0.5 w-full bg-indigo-600 bottom-[-12px] left-0'></div>
                              )}
                            </Link>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Profile Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className={`rounded-full ${isActive('/dashboard/profile') || isActive('/dashboard/change-password')
                            ? 'text-indigo-700 font-medium hover:bg-blue-400'
                            : 'text-gray-600 hover:text-indigo-600 hover:bg-blue-400'
                            }`}
                        >
                          <User color="#ffffff" className='h-0 w-40 ' />
                          <span className='sr-only'>Toggle user menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className='w-56' align='end' forceMount>
                        <DropdownMenuLabel className='font-normal'>
                          <div className='flex flex-col space-y-1'>
                            <p className='text-sm font-medium leading-none'>
                              {data?.user?.name || 'User'}
                            </p>
                            <p className='text-xs leading-none text-muted-foreground'>
                              {data?.user?.email || 'N/A'}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href='/dashboard/profile'>
                            <User className='mr-2 h-4 w-4' />
                            <span>Profile</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href='/dashboard/change-password'>
                            <Shield className='mr-2 h-4 w-4' />
                            <span>Settings</span>
                          </Link>
                        </DropdownMenuItem>
                        {/* New 'Create Card' item, visible only to creators */}
                        {data?.user?.role === 'creator' && (
                          <DropdownMenuItem asChild>
                            <Link href='/dashboard/create-card'>
                              <IdCard className='mr-2 h-4 w-4' />
                              <span>Create Card</span>
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut className='mr-2 h-4 w-4' />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </nav>
                </div>
              </header>
              <main className='flex-1 container mx-auto px-4 py-8'>{children}</main>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center p-4 h-screen'>
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Welcome!</h1>
                <p className="text-xl text-gray-200">Please select your role to continue.</p>
              </div>
              <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8 w-full max-w-6xl">
                {/* Creator Role Card */}
                <button
                  onClick={() => setRole('creator')}
                  disabled={loading} // Disable button while loading
                  className="flex-1 bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-6 text-center cursor-pointer hover:bg-white/20 transition duration-300 ease-in-out h-full flex flex-col justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <h2 className="text-2xl font-semibold text-[#09d4d5] mb-3">Creator Role</h2>
                  <p className="text-gray-300">Manage your invoices, clients, and projects.</p>
                  {loading && <span className="mt-2 text-sm text-gray-400">Setting role...</span>}
                </button>
                {/* Customer Role Card */}
                <button
                  onClick={() => setRole('customer')}
                  disabled={loading} // Disable button while loading
                  className="flex-1 bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-6 text-center cursor-pointer hover:bg-white/20 transition duration-300 ease-in-out h-full flex flex-col justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <h2 className="text-2xl font-semibold text-[#f538ff] mb-3">Customer Role</h2>
                  <p className="text-gray-300">View and manage invoices sent to you.</p>
                  {loading && <span className="mt-2 text-sm text-gray-400">Setting role...</span>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

