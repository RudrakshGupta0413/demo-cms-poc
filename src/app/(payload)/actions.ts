'use server'

import { handleServerFunctions } from '@payloadcms/next/layouts'
import { ServerFunctionClient } from 'payload'
import config from '@/payload.config'
import { importMap } from './admin/importMap.js'

export const serverFunction: ServerFunctionClient = async function (args) {
    return handleServerFunctions({
        ...args,
        config,
        importMap,
    })
}
