import type { LinksFunction } from "react-router";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import globalStyles from "./styles/global.scss?url";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: globalStyles },
];

export default function App() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: "2024-12-23T12:34:00-05:00",
    dateModified: "2024-12-26T14:53:00-05:00",
    mainEntity: {
      "@type": "Person",
      name: "Mayur Kashyap",
      alternateName: "mayurkashyap60",
      identifier: "9871593517",
      interactionStatistic: [
        {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/FollowAction",
          userInteractionCount: 1,
        },
        {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/LikeAction",
          userInteractionCount: 5,
        },
      ],
      agentInteractionStatistic: {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/WriteAction",
        userInteractionCount: 2346,
      },
      description:
        "Highly experienced front-end developer with 5+ years specializing in building accessible and user-centric web products",
      image: "https://www.mayurkashyap.com/assets/images/mayur.JPG",
      sameAs: [
        "https://www.mayurkashyap.com",
        "https://github.com/mayurkashyap60",
      ],
    },
  };

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      </head>
      <body>
        <Header />

        <main className="main">
          <Outlet />
        </main>

        <Footer />

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
