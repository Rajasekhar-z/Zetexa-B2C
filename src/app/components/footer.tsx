// components/Footer.tsx
export default function Footer({branding}: {branding: any}) {
    return (
      <footer className="bg-gradient-to-r from-blue-600 to-indigo-700 border-t border-gray-200 text-gray-50 py-6 mt-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} {branding?.branding_name}. All rights reserved.</p>
          <ul className="flex gap-4 text-sm">
            <li className="hover:scale-105">
              <a href="/privacy" >Privacy Policy</a>
            </li>
            <li className="hover:scale-105">
              <a href="/terms">Terms & Conditions</a>
            </li>
            <li className="hover:scale-105">
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>
      </footer>
    )
  }
  