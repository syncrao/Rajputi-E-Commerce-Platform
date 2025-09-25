export default function Footer() {
  return (
    <footer className="bg-brand-black text-brand-primaryText mt-4">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-12 lg:px-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold text-brand-blue">SyncRao</h2>
            <p className="mt-4 text-sm text-brand-primaryText">
              Your one-stop destination for fashion, accessories, and more.
              Quality products at the best prices.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold text-brand-orange uppercase tracking-wider">
              Shop
            </h3>
            <ul className="mt-4 space-y-3">
              <li><a href="#" className="hover:text-brand-blue">Women</a></li>
              <li><a href="#" className="hover:text-brand-blue">Men</a></li>
              <li><a href="#" className="hover:text-brand-blue">Kids</a></li>
              <li><a href="#" className="hover:text-brand-blue">New Arrivals</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-brand-orange uppercase tracking-wider">
              Support
            </h3>
            <ul className="mt-4 space-y-3">
              <li><a href="#" className="hover:text-brand-blue">Contact Us</a></li>
              <li><a href="#" className="hover:text-brand-blue">Shipping</a></li>
              <li><a href="#" className="hover:text-brand-blue">Returns</a></li>
              <li><a href="#" className="hover:text-brand-blue">FAQs</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-brand-orange uppercase tracking-wider">
              Follow Us
            </h3>
            <div className="mt-4 flex space-x-6">
              {/* Social Icons */}
              <a href="#" className="hover:text-brand-blue" aria-label="Facebook">
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88v-6.99h-2.54V12h2.54V9.79c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99C18.34 21.13 22 17 22 12z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-brand-blue" aria-label="Instagram">
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9zm4.5 3.5a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.25-2.75a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-brand-blue" aria-label="Twitter">
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <path d="M22 5.92c-.77.35-1.6.58-2.46.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04 4.28 4.28 0 0 0-7.3 3.9A12.14 12.14 0 0 1 3.15 4.6a4.27 4.27 0 0 0 1.32 5.7 4.25 4.25 0 0 1-1.94-.54v.05a4.28 4.28 0 0 0 3.44 4.2 4.28 4.28 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.97A8.58 8.58 0 0 1 2 19.54a12.1 12.1 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.38-.01-.57A8.7 8.7 0 0 0 22 5.92z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-brand-blue pt-6 text-center text-sm text-brand-primaryText">
          <p>&copy; {new Date().getFullYear()} SyncRao. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
