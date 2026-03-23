import * as React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import '../styles/Footer.css'

export const Footer = async () => {
    const payload = await getPayload({ config })
    const footerData = await payload.findGlobal({ slug: 'footer' }) as any

    const logoText = footerData?.logo?.text || ''
    const tagline = footerData?.logo?.tagline || ''
    const quickLinks = footerData?.quickLinks || []
    const companyLinks = footerData?.companyLinks || []
    const helpLinks = footerData?.helpLinks || []
    const enquiryText = footerData?.enquiryText || ''
    const copyrightText = footerData?.copyrightText || ''
    const socialLinks = footerData?.socialLinks || {}

    return (
        <footer className="footer">
            {/* Decorative top border */}
            <div className="footer-border-top" />

            {/* Upper section */}
            <div className="footer-upper">
                {/* Brand column */}
                {(logoText || tagline) && (
                    <div className="footer-brand">
                        {logoText && <div className="footer-logo">{logoText}</div>}
                        {tagline && <p className="footer-tagline">{tagline}</p>}
                    </div>
                )}

                {/* Quick Links */}
                {quickLinks.length > 0 && (
                    <div className="footer-column">
                        <span className="footer-column-title">Quick Links</span>
                        {quickLinks.map((link: any, i: number) => (
                            <Link key={i} href={link.url || '/'} className="footer-link">{link.label}</Link>
                        ))}
                    </div>
                )}

                {/* Company */}
                {companyLinks.length > 0 && (
                    <div className="footer-column">
                        <span className="footer-column-title">Company</span>
                        {companyLinks.map((link: any, i: number) => (
                            <Link key={i} href={link.url || '/'} className="footer-link">{link.label}</Link>
                        ))}
                    </div>
                )}

                {/* Help */}
                {helpLinks.length > 0 && (
                    <div className="footer-column">
                        <span className="footer-column-title">Help</span>
                        {helpLinks.map((link: any, i: number) => (
                            <Link key={i} href={link.url || '/'} className="footer-link">{link.label}</Link>
                        ))}
                    </div>
                )}

                {/* For Enquiries */}
                {enquiryText && (
                    <div className="footer-column">
                        <span className="footer-column-title">For Enquiries</span>
                        <span className="footer-enquiry-text">{enquiryText}</span>
                    </div>
                )}
            </div>

            {/* Bottom bar */}
            <div className="footer-bottom">
                {copyrightText && <span className="footer-copyright">{copyrightText}</span>}
                <div className="footer-socials">
                    {socialLinks.facebook && (
                        <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Facebook">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                            </svg>
                        </a>
                    )}
                    {socialLinks.instagram && (
                        <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
                                <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
                                <circle cx="17.5" cy="6.5" r="1.5" />
                            </svg>
                        </a>
                    )}
                    {socialLinks.twitter && (
                        <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="X">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                    )}
                    {socialLinks.youtube && (
                        <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="YouTube">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z" />
                                <polygon points="9.75,15.02 15.5,11.75 9.75,8.48" fill="#faf8f5" />
                            </svg>
                        </a>
                    )}
                </div>
            </div>
        </footer>
    )
}
