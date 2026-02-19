/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT. BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import React from 'react'
import { importMap } from './admin/importMap.js'
import config from '@/payload.config'
import '@payloadcms/next/css'
import { RootLayout } from '@payloadcms/next/layouts'
import { serverFunction } from './actions'

type Args = {
    children: React.ReactNode
}

const Layout = ({ children }: Args) => (
    <RootLayout importMap={importMap} config={config} serverFunction={serverFunction}>
        {children}
    </RootLayout>
)

export default Layout
