'use client'

import Link from 'next/link'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Briefcase,
  Edit,
  Shield,
  Facebook,
  Twitter,
  Instagram,
} from 'lucide-react'
import { authClient, useSession } from '~/lib/auth'

export default function Profile() {
  const session = useSession();
  const user = session?.data?.user;

  // Helper to get initials
  const getInitials = (name?: string, lastName?: string) => {
    if (!name && !lastName) return 'U';
    return (
      (name?.[0] ?? '') +
      (lastName?.[0] ?? '')
    ).toUpperCase();
  };

  // Social links
  const socialLinks = {
    facebook: user?.facebook ?? '',
    twitter: user?.twitter ?? '',
    instagram: user?.instagram ?? '',
  };

  // Skills placeholder (no skills in session data)
  const skills: string[] = [];

  return (
    <div className='max-w-4xl mx-auto '>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-white'>My Profile</h1>
        <div className='flex space-x-2'>
          <Link href='/dashboard/edit-profile'>
            <Button
              variant='outline'
              size='sm'
              className='flex items-center border-blue-500 hover:border-blue-700 text-white bg-blue-500 hover:bg-blue-700'
            >
              <Edit className='mr-2 h-4 w-4' />
              Edit Profile
            </Button>
          </Link>
          <Link href='/dashboard/change-password'>
            <Button
              variant='outline'
              size='sm'
              className='flex items-center border-blue-500 hover:border-blue-700 text-white bg-blue-500 hover:bg-blue-700'
            >
              <Shield className='mr-2 h-4 w-4' />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 '>
        <div className='md:col-span-1'>
          <Card className='border-white/10 backdrop-blur-md bg-white/20'>
            <CardContent className='pt-6'>
              <div className='flex flex-col items-center'>
                <Avatar className='h-24 w-24 mb-4'>
                  <AvatarImage
                    src={user?.image ?? '/placeholder.svg?height=96&width=96'}
                    alt={`${user?.name ?? ''} ${user?.lastName ?? ''}`}
                    className="object-cover object-center w-full h-full"
                  />
                  <AvatarFallback className='bg-blue-500 text-[#71fff0] text-xl'>
                    {getInitials(user?.name, user?.lastName)}
                  </AvatarFallback>
                </Avatar>
                <h2 className='text-xl font-bold text-white'>
                  {user?.name ?? 'No Name'} {user?.lastName ?? ''}
                </h2>
                <p className='text-white text-sm'>
                  {user?.profession ?? 'No profession'}
                </p>
                <p className='text-white text-sm flex items-center mt-1'>
                  <MapPin className='h-3 w-3 mr-1' />
                  {user?.location ?? 'N/A'}
                </p>
              </div>

              <div className='mt-6 space-y-3'>
                <div className='flex items-start'>
                  <Mail className='h-5 w-5 text-[#71fff0] mr-3 mt-0.5' />
                  <div>
                    <p className='text-sm font-medium text-white'>Email</p>
                    <p className='text-sm text-white'>{user?.email ?? ''}</p>
                  </div>
                </div>
                <div className='flex items-start'>
                  <Calendar className='h-5 w-5 text-[#71fff0] mr-3 mt-0.5' />
                  <div>
                    <p className='text-sm font-medium text-white'>
                      Member Since
                    </p>
                    <p className='text-sm text-white'>
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : 'Unknown'}
                    </p>
                  </div>
                </div>
                <div className='flex items-start'>
                  <Briefcase className='h-5 w-5 text-[#71fff0] mr-3 mt-0.5' />
                  <div>
                    <p className='text-sm font-medium text-white'>
                      Occupation
                    </p>
                    <p className='text-sm text-white'>
                      {user?.profession ?? 'No profession'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='md:col-span-2'>
          <Tabs defaultValue='about' className='w-full'>
            <TabsList className='grid w-full grid-cols-3 bg-white/10'>
              <TabsTrigger className='text-white' value='about'>About</TabsTrigger>
              <TabsTrigger className='text-white' value='skills'>Skills</TabsTrigger>
              <TabsTrigger className='text-white' value='social'>Social</TabsTrigger>
            </TabsList>
            <TabsContent value='about'>
              <Card className='border-white/10 backdrop-blur-md bg-white/20'>
                <CardHeader>
                  <CardTitle className='text-[#71fff0]'>About Me</CardTitle>
                  <CardDescription className='text-white'>
                    Personal information and bio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-white whitespace-pre-line'>
                    {user?.biography ?? 'No biography provided.'}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='skills'>
              <Card className='border-white/10 backdrop-blur-md bg-white/20'>
                <CardHeader>
                  <CardTitle className='text-[#71fff0]'>Skills</CardTitle>
                  <CardDescription className='text-white'>
                    Technical skills and expertise
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-wrap gap-2'>
                    {skills.length === 0 && (
                      <span className='text-white text-sm'>No skills listed.</span>
                    )}
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className='px-3 py-1 bg-blue-500 text-[#71fff0] rounded-full text-sm'
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='social'>
              <Card className='border-white/10 backdrop-blur-md bg-white/20'>
                <CardHeader>
                  <CardTitle className='text-[#71fff0]'>
                    Social Links
                  </CardTitle>
                  <CardDescription className='text-white'>
                    Connect with me on social platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {Object.entries(socialLinks).every(([_, v]) => !v) && (
                      <span className='text-white text-sm'>No social links provided.</span>
                    )}
                    {Object.entries(socialLinks)
                      .filter(([_, link]) => !!link)
                      .map(([platform, link]) => (
                        <div key={platform} className='flex items-center'>
                          <div className='w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mr-3'>
                            {platform === 'facebook' && <Facebook className='h-5 w-5 text-white' />}
                            {platform === 'twitter' && <Twitter className='h-5 w-5 text-white' />}
                            {platform === 'instagram' && <Instagram className='h-5 w-5 text-white' />}
                          </div>
                          <div>
                            <p className='text-sm font-medium text-white capitalize'>
                              {platform}
                            </p>
                            <a
                              href={`https://${link}`}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-sm text-blue-200 hover:underline'
                            >
                              {link}
                            </a>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className='border-white/10 backdrop-blur-md bg-white/20 mt-6'>
            <CardHeader>
              <CardTitle className='text-[#71fff0]'>Recent Activity</CardTitle>
              <CardDescription className='text-white'>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex'>
                  <div className='mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500'>
                    <User className='h-5 w-5 text-white' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-white'>Profile Updated</p>
                    <p className='text-xs text-white'>
                      You updated your profile information
                    </p>
                    <p className='text-xs text-white mt-1'>2 days ago</p>
                  </div>
                </div>
                <div className='flex'>
                  <div className='mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500'>
                    <Shield className='h-5 w-5 text-white' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-white'>Password Changed</p>
                    <p className='text-xs text-white'>
                      You successfully changed your password
                    </p>
                    <p className='text-xs text-white mt-1'>1 week ago</p>
                  </div>
                </div>
                <div className='flex'>
                  <div className='mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500'>
                    <Mail className='h-5 w-5 text-white' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-white'>Email Verified</p>
                    <p className='text-xs text-white'>
                      Your email address has been verified
                    </p>
                    <p className='text-xs text-white mt-1'>2 weeks ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
