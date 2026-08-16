import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import SEO from "@/components/SEO";

const NotFound = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <SEO
        title="Page not found — Sitch"
        description="This Sitch page does not exist. Head back to the home screen to keep playing."
        path="/404"
        noindex
      />

      <div className="mx-auto max-w-sm text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Shield className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="mb-2 text-4xl font-black text-foreground">404</h1>
        <p className="mb-6 text-lg text-muted-foreground">This page doesn't exist</p>
        <Link
          to="/"
          className="inline-block rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
