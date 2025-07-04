'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { usePathname, useRouter } from 'next/navigation'
import { Home, LogOut, User, Shield, Users, Search } from 'lucide-react' // Added Search icon
//
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
// Import dropdown menu components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
// Import Input component
import { Input } from '~/components/ui/input'
import { authClient, useSession } from '~/lib/auth'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)

  const { data } = useSession()

  // Check user role on component mount
  useEffect(() => {
    if (data?.user?.isAdmin) {
      setIsAdmin(true)
    }
  }, [data])

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

  // Removed navItems array
  // const navItems = [
  //   // Removed Dashboard item: { href: '/dashboard', label: 'Dashboard', icon: Home },
  //   // Removed Profile and Security from main navItems
  // ]

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

  return (
    <div className='min-h-screen bg-[url("/bg.jpg")] bg-cover bg-center bg-fixed flex flex-col'>
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
            {/* Removed navItems map */}
            {/* {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1 relative ${isActive(item.href)
                  ? 'text-indigo-700 font-medium'
                  : 'text-gray-600 hover:text-indigo-600'
                  }`}
              >
                <item.icon className='h-4 w-4' />
                <span>{item.label}</span>
                {isActive(item.href) && (
                  <div className='absolute h-0.5 w-full bg-indigo-600 bottom-[-12px] left-0'></div>
                )}
              </Link>
            ))} */}

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
                    ? 'text-indigo-700 font-medium'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-blue-400'
                    }`}
                >
                  <User color="#ffffff" className='h-40 w-40 ' />
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
  )
}

