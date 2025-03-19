import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Music,
  Play,
  Users,
  MessageSquare,
  Headphones,
  Heart,
  ChevronRight,
} from "lucide-react";
import Appbar from "@/components/Appbar";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Appbar/>
      <main className="flex-1">
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-fuchsia-500/20 to-cyan-500/20 z-0" />
          <div className="container relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                    Interactive Music Streaming{" "}
                    <span className="text-primary">Reimagined</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Connect with your fans in real-time. Let them influence your
                    music streams and build a community around your sound.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700"
                  >
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline">
                    <Play className="mr-2 h-4 w-4" /> Watch Demo
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Join 10,000+ creators already using Muzer</span>
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-[500px] pt-8 lg:pt-0">
                <div className="relative z-10 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 p-1 shadow-2xl">
                  <div className="rounded-lg bg-background p-2">
                    <Image
                      src="/img2.jpg"
                      width={400}
                      height={600}
                      alt="App interface showing a live music stream with fan interactions"
                      className="rounded-md w-full h-auto"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 z-0 h-[250px] w-[250px] rounded-full bg-cyan-500/30 blur-3xl" />
                <div className="absolute -top-6 -right-6 z-0 h-[250px] w-[250px] rounded-full bg-purple-500/30 blur-3xl" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20" id="features">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Features That <span className="text-primary">Amplify</span> Your
                Music
              </h2>
              <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                Everything you need to create engaging, interactive music
                experiences for your audience.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Feature 1 */}
              <div className="group relative overflow-hidden rounded-lg border p-6 hover:border-primary transition-colors">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-fuchsia-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Music className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Curated Playlists</h3>
                  <p className="text-muted-foreground">
                    Create and manage playlists for your streams. Organize your
                    music library for quick access during live sessions.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group relative overflow-hidden rounded-lg border p-6 hover:border-primary transition-colors">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-fuchsia-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Fan Requests</h3>
                  <p className="text-muted-foreground">
                    Let your audience request songs during your stream. Approve
                    requests with a single click and add them to your queue.
                  </p>
                </div>
              </div>

              {/* Feature 5 */}
              <div className="group relative overflow-hidden rounded-lg border p-6 hover:border-primary transition-colors">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-fuchsia-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Headphones className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">High-Quality Audio</h3>
                  <p className="text-muted-foreground">
                    Stream your music in crystal clear quality. Support for
                    lossless audio ensures your fans hear every detail.
                  </p>
                </div>
              </div>

              {/* Feature 6 */}
              <div className="group relative overflow-hidden rounded-lg border p-6 hover:border-primary transition-colors">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-fuchsia-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Heart className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">
                    Fan Engagement Tools
                  </h3>
                  <p className="text-muted-foreground">
                    Reward your most engaged listeners with exclusive content,
                    shoutouts, and personalized experiences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="py-20 bg-gradient-to-br from-purple-500/10 via-fuchsia-500/10 to-cyan-500/10"
          id="how-it-works"
        >
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                How <span className="text-primary">Muzer</span> Works
              </h2>
              <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                A seamless experience for both creators and fans.
              </p>
            </div>

            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="relative mx-auto w-full max-w-[500px]">
                <div className="relative z-10 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 p-1 shadow-2xl">
                  <div className="rounded-lg bg-background p-2">
                    <Image
                      src="/img3.jpg"
                      width={400}
                      height={600}
                      alt="App interface showing the creator dashboard"
                      className="rounded-md w-full h-auto"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 z-0 h-[250px] w-[250px] rounded-full bg-cyan-500/30 blur-3xl" />
              </div>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Create Your Stream</h3>
                    <p className="text-muted-foreground mt-2">
                      Set up your stream in minutes. Import your music library,
                      customize your stream settings, and prepare your
                      playlists.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Go Live</h3>
                    <p className="text-muted-foreground mt-2">
                      Start your stream with a single click. Your fans will be
                      notified and can join immediately.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">
                      Engage With Your Audience
                    </h3>
                    <p className="text-muted-foreground mt-2">
                      Interact with your fans in real-time. Accept song
                      requests, respond to comments, and create polls.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Grow Your Community</h3>
                    <p className="text-muted-foreground mt-2">
                      Build a loyal following with consistent streams. Analyze
                      your performance and improve with each session.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="py-20 bg-gradient-to-br from-purple-500/10 via-fuchsia-500/10 to-cyan-500/10"
          id="faq"
        >
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Frequently Asked <span className="text-primary">Questions</span>
              </h2>
              <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                Everything you need to know about Muzer.
              </p>
            </div>

            <div className="mx-auto max-w-3xl space-y-4">
              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-bold">
                  How does fan interaction work?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Fans can request songs, vote in polls, and send reactions
                  during your stream. You have full control over which requests
                  to accept and can manage the queue in real-time.
                </p>
              </div>

              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-bold">What music can I stream?</h3>
                <p className="mt-2 text-muted-foreground">
                  You can stream music from your personal library or connect to
                  popular streaming services. We ensure all licensing
                  requirements are met to keep your streams legal and
                  worry-free.
                </p>
              </div>

              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-bold">
                  Can I monetize my streams?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Yes! Pro and Premium plans allow you to receive tips, sell
                  virtual items, and offer premium content to your fans. We
                  handle all payment processing with minimal fees.
                </p>
              </div>

              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-bold">
                  What devices are supported?
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Muzer works on all modern web browsers, iOS, and Android
                  devices. Creators can stream from desktop for the best
                  experience, while fans can join from any device.
                </p>
              </div>

              <div className="rounded-lg border p-6">
                <h3 className="text-lg font-bold">How do I get started?</h3>
                <p className="mt-2 text-muted-foreground">
                  Simply sign up for a free account, set up your profile, and
                  you can start streaming in minutes. Our intuitive interface
                  makes it easy to get started, even if you&apos;re new to streaming.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <div className="rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 p-8 md:p-12 shadow-xl">
              <div className="grid gap-6 lg:grid-cols-2 items-center">
                <div>
                  <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl">
                    Ready to transform your music streams? It&apos;s free and open
                    source!
                  </h2>
                  <p className="mt-4 text-white/90 md:text-xl">
                    Join thousands of creators who are building communities
                    around their music with Muzer.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-white/90"
                  >
                    Get Started Free
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-white border-white hover:bg-white/10"
                  >
                    View on GitHub
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background">
        <div className="container py-12">
          <div className="grid gap-8 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Music className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Muzer</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The platform for interactive music streaming experiences.
                Connect with your fans in real-time.
              </p>
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Changelog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Press
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Licenses
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Settings
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Muzer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
