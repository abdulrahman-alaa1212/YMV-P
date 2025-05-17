export function Footer() {
  return (
    <footer className="bg-card shadow-md mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p className="text-sm">&copy; {new Date().getFullYear()} AR/MR Advisor. All rights reserved.</p>
      </div>
    </footer>
  );
}
