'use client';

import { FC, useEffect, useState } from "react";
import { signOut } from "next-auth/react"

const showThemeToogle = false;
const showAuthTab = true;

interface NavbarProps {
  isLoggedIn: boolean
  theme: string
  isProtectedRoute?: boolean
  userRole?: string
}

const Navbar: FC<NavbarProps> = (props) => {
  return (
    <nav className="bg-base-100 w-full border-b-2 border-base-300">
      <div className="navbar container mx-auto">
        {/* Left */}
        <div className="navbar-start">
          {props.isLoggedIn && (
            <a href={props.isProtectedRoute ? "/" : "/me/stats"}>
              <div tabIndex={0} role="button" className="btn btn-ghost m-1">
                {props.isProtectedRoute ? "Start Test" : "My Stats"}
              </div>
            </a>
          )}
          {props.isLoggedIn && props.userRole === "ADMIN" && (
            <a href="/admin">
              <div tabIndex={0} role="button" className="btn btn-ghost m-1">
                Admin
              </div>
            </a>
          )}
        </div>
        {/* Center */}
        <div className="navbar-center">
          <a className="btn btn-ghost text-xl" href="/">reaction time test</a>
        </div>
        {/* Right */}
        <div className="navbar-end">
          {showAuthTab && !props.isLoggedIn && (
            <a href="/login">
              <div tabIndex={0} role="button" className="btn btn-ghost m-1">Login</div>
            </a>
          )}
          {showAuthTab && props.isLoggedIn && (
            <>
              <a className="btn btn-ghost m-1" onClick={() => signOut()}>Logout</a>
            </>
          )}
          {showThemeToogle && (
            <div className="dropdown dropdown-end">
              <ThemeToggle initialValue={props.theme} />
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

interface ThemeToggleProps {
  initialValue: string
}

const ThemeToggle: FC<ThemeToggleProps> = (props) => {
  const [theme, setTheme] = useState(props.initialValue);

  useEffect(() => {
    if (theme) {
      document.cookie = `theme=${theme};path=/;`;
      (document.querySelector('html') as any).setAttribute('data-theme', theme);
    } else {
      setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
  }, [theme]);

  return (
    <>
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost m-1">Themes</div>
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 h-[28.6rem] max-h-[calc(100vh-10rem)] overflow-auto p-2 shadow-sm">
          <li><a onClick={() => setTheme('light')}>light</a></li>
          <li><a onClick={() => setTheme('dark')}>dark</a></li>
          <li><a onClick={() => setTheme('cupcake')}>cupcake</a></li>
          <li><a onClick={() => setTheme('bumblebee')}>bumblebee</a></li>
          <li><a onClick={() => setTheme('emerald')}>emerald</a></li>
          <li><a onClick={() => setTheme('corporate')}>corporate</a></li>
          <li><a onClick={() => setTheme('synthwave')}>synthwave</a></li>
          <li><a onClick={() => setTheme('retro')}>retro</a></li>
          <li><a onClick={() => setTheme('cyberpunk')}>cyberpunk</a></li>
          <li><a onClick={() => setTheme('valentine')}>valentine</a></li>
          <li><a onClick={() => setTheme('halloween')}>halloween</a></li>
          <li><a onClick={() => setTheme('garden')}>garden</a></li>
          <li><a onClick={() => setTheme('forest')}>forest</a></li>
          <li><a onClick={() => setTheme('aqua')}>aqua</a></li>
          <li><a onClick={() => setTheme('lofi')}>lofi</a></li>
          <li><a onClick={() => setTheme('pastel')}>pastel</a></li>
          <li><a onClick={() => setTheme('fantasy')}>fantasy</a></li>
          <li><a onClick={() => setTheme('wireframe')}>wireframe</a></li>
          <li><a onClick={() => setTheme('black')}>black</a></li>
          <li><a onClick={() => setTheme('luxury')}>luxury</a></li>
          <li><a onClick={() => setTheme('dracula')}>dracula</a></li>
          <li><a onClick={() => setTheme('cmyk')}>cmyk</a></li>
          <li><a onClick={() => setTheme('autumn')}>autumn</a></li>
          <li><a onClick={() => setTheme('business')}>business</a></li>
          <li><a onClick={() => setTheme('acid')}>acid</a></li>
          <li><a onClick={() => setTheme('lemonade')}>lemonade</a></li>
          <li><a onClick={() => setTheme('night')}>night</a></li>
          <li><a onClick={() => setTheme('coffee')}>coffee</a></li>
          <li><a onClick={() => setTheme('winter')}>winter</a></li>
          <li><a onClick={() => setTheme('dim')}>dim</a></li>
          <li><a onClick={() => setTheme('nord')}>nord</a></li>
          <li><a onClick={() => setTheme('sunset')}>sunset</a></li>
        </ul>
      </div>
    </>
  )
}

export { Navbar }