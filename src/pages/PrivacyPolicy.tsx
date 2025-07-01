import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-8">
          <div>
            <Link to="/" className="text-sm font-medium text-primary hover:text-primary/80">
              &larr; Back to Home
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mt-2">
              Privacy Policy
            </h1>
            <p className="mt-4 text-muted-foreground">
              Last updated: July 01, 2025
            </p>
          </div>

          <div className="space-y-6 text-muted-foreground">
            <p>
              Welcome to Promptify! We are committed to protecting your privacy. This Privacy Policy explains how we handle your personal information to protect your privacy. Our goal is to be as transparent as possible, using simple language.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Information We Collect</h2>
            <p className="text-muted-foreground">
              Our philosophy is to collect the minimum amount of information necessary to provide our service. Here's what we collect and store:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <strong>Account Information:</strong> When you create an account, we store your email address, your name (if you provide it), and a secure, encrypted version of your password. If you sign in with a third-party service like Google, we store your email address and name as provided by that service.
              </li>
              <li>
                <strong>User Content:</strong> We store the prompts you generate and save to your history or favorites. We also securely store your encrypted OpenRouter API key so you don't have to enter it every time.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">How We Use Cookies & Local Storage</h2>
            <p className="text-muted-foreground">
              We do not use traditional tracking cookies for advertising or third-party analytics. We use your browser's local storage for essential application functionality only:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <strong>Authentication Token:</strong> We store a secure token from Supabase to keep you logged into your account. This is essential for the site to remember who you are between visits.
              </li>
              <li>
                <strong>Theme Preference:</strong> We store your choice of theme (light or dark mode) so the site remembers your preference on your next visit.
              </li>
              <li>
                <strong>Cookie Consent:</strong> We store a simple flag to remember that you have acknowledged our use of essential storage, so we don't show you the consent banner on every visit.
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Data Security</h2>
            <p className="text-muted-foreground">
              We take data security seriously. Your API key is encrypted in our database, and we follow industry best practices to protect your information.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 