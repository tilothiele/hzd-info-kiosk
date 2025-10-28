'use client'

import { useEffect } from 'react'

export default function RuntimeConfigLoader () {
	useEffect(() => {
		const script = document.createElement('script')
		script.src = '/runtime-config.js'
		script.async = true
		document.body.appendChild(script)
		return () => {
			if (script.parentNode) script.parentNode.removeChild(script)
		}
	}, [])
	return null
}
