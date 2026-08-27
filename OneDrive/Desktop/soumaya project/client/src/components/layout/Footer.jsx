import { Mail, Heart } from 'lucide-react'
import { FaInstagram, FaFacebookF } from 'react-icons/fa6'

const footerLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Features',     href: '#features' },
  { label: 'Pricing',      href: '#pricing' },
  { label: 'FAQ',          href: '#faq' },
  { label: 'Order',        href: '#order' },
]

export default function Footer() {
  return (
    <footer className="bg-ink text-cream/80">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-cream/10">
          {/* Brand */}
          <div>
            <span className="font-script text-4xl text-rose block mb-3">Invitia</span>
            <p className="font-body text-sm text-cream/50 leading-relaxed max-w-xs">
              Bespoke digital wedding invitations crafted with elegance.
              Your love story, beautifully told — shared in a single link.
            </p>
            <div className="flex gap-4 mt-5">
              <a href="#" aria-label="Instagram" className="text-cream/40 hover:text-rose transition-colors">
                <FaInstagram size={18} />
              </a>
              <a href="#" aria-label="Facebook" className="text-cream/40 hover:text-rose transition-colors">
                <FaFacebookF size={16} />
              </a>
              <a href="mailto:hello@invitia.io" aria-label="Email" className="text-cream/40 hover:text-rose transition-colors">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-body text-xs tracking-widest uppercase text-cream/30 mb-5">Navigation</h4>
            <ul className="space-y-3">
              {footerLinks.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-cream/55 hover:text-rose transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body text-xs tracking-widest uppercase text-cream/30 mb-5">Contact</h4>
            <p className="font-body text-sm text-cream/55 leading-relaxed">
              Questions about your invitation?<br />
              We're here to help.
            </p>
            <a
              href="mailto:hello@invitia.io"
              className="inline-block mt-4 text-sm font-body text-rose hover:text-cream transition-colors"
            >
              hello@invitia.io
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-cream/30">
            © {new Date().getFullYear()} Invitia. All rights reserved.
          </p>
          <p className="font-body text-xs text-cream/25 flex items-center gap-1">
            Crafted with <Heart size={10} className="text-rose fill-rose" /> for unforgettable moments
          </p>
        </div>
      </div>
    </footer>
  )
}
