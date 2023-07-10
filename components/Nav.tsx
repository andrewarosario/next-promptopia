'use client';

import { BuiltInProviderType } from 'next-auth/providers';
import { ClientSafeProvider, LiteralUnion, getProviders, signIn, signOut, useSession } from 'next-auth/react';
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Nav = () => {
  const { data: session } = useSession()
  const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null);
  const [toggleDropdown, setToggleDropdown] = useState(false)

  useEffect(() => {
    const setProvidersResponse = async () => {
        const response = await getProviders()
        setProviders(response);
    }
    setProvidersResponse()
  })

  return (
    <nav className="flex-between w-full mg-16 pt-3">
        <Link href="/" className="flex gap-2 flex-center">
            <Image src="/assets/images/logo.svg" alt="Promptopia Logo" width={30} height={30} className="object-contain"/>
            <p className="logo_text">Promptopia</p>
        </Link>

        {/* Desktop Nvigation */}
        <div className="sm:flex hidden">
            {session?.user ? (
                <div className="flex gap-3 md:gap-5">
                    <Link href="create-prompt" className="black_btn">Create post</Link>
                    <button type="button" className="outline_btn">Sign Out</button>
                    <Link href="profile">
                        <Image 
                          src="/assets/images/logo.svg"
                          width={37}
                          height={37}
                          className="rounded-full"
                          alt="profile"
                        >
                        </Image>
                    </Link>
                </div>
            ) : (
                <>
                    {providers &&
                     Object.values(providers).map(provider => (
                        <button type="button" key={provider.name} onClick={() => signIn(provider.id)} className='black_btn'>
                            Sign In
                        </button>
                     ))

                    }
                </>
            )}
        </div>

        {/* Mobile navigation */}
        <div className="sm:hidden flex relative">
            {session?.user ? (
            <div className='flex'>
                <Image 
                    src="/assets/images/logo.svg"
                    width={37}
                    height={37}
                    className="rounded-full"
                    alt="profile"
                    onClick={() => { setToggleDropdown(prev => !prev) }}
                >
                </Image>
                {toggleDropdown && (
                    <div className="dropdown">
                        <Link
                            href="/profile"
                            className='dropdown_link'
                            onClick={() => setToggleDropdown(false)}>
                                My Profile
                        </Link>
                        <Link
                            href="/create-prompt"
                            className='dropdown_link'
                            onClick={() => setToggleDropdown(false)}>
                                Create prompt
                        </Link>
                        <button 
                            type="button"
                            className='mt-5 w-full black_btn'
                            onClick={() => {
                                setToggleDropdown(false);
                                signOut();
                            }}
                        >
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
            ) : (
                <>
                {providers &&
                 Object.values(providers).map(provider => (
                    <button type="button" key={provider.name} onClick={() => signIn(provider.id)} className='black_btn'>
                        Sign In
                    </button>
                 ))
                }
                </>
            )}
        </div>
    </nav>
  )
}

export default Nav