/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Kbd.css'
import type { ReactNode } from 'react'

export type KbdSize = 'sm' | 'md' | 'lg'

export interface KbdProps {
  size?: KbdSize
  keys?: string[]
  children?: ReactNode
  className?: string
}

export function Kbd({ size = 'md', keys = [], children, className = '' }: KbdProps) {
  const kbdClass = [
    'sp-kbd',
    size !== 'md' && `sp-kbd--${size}`,
  ].filter(Boolean).join(' ')

  if (keys.length > 0) {
    return (
      <span className={['sp-kbd-host', className].filter(Boolean).join(' ')}>
        {keys.map((key, i) => (
          <span key={i}>
            <kbd className={kbdClass}>{key}</kbd>
            {i < keys.length - 1 && (
              <span className="sp-kbd__sep" aria-hidden="true">+</span>
            )}
          </span>
        ))}
      </span>
    )
  }

  return (
    <span className={['sp-kbd-host', className].filter(Boolean).join(' ')}>
      <kbd className={kbdClass}>{children}</kbd>
    </span>
  )
}
