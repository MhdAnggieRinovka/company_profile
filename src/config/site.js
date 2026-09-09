export const SITE_NAME = "KYUB";

// TODO: replace with your production domain before deploying
export const SITE_URL = "https://kyubstudio.com";

export const SITE_DEFAULT_DESCRIPTION =
  "KYUB - IDEA, DESIGN & PRODUCTION UNDER ONE ROOF";

export const SITE_DEFAULT_IMAGE = `${SITE_URL}/og-default.jpg`;

export const SITE_TWITTER_HANDLE = "";

export function getPageSeoConfig(page) {
  const configs = {
    home: {
      title: `${SITE_NAME} — Idea, Design & Production Under One Roof`,
      description: SITE_DEFAULT_DESCRIPTION,
    },
    about: {
      title: `About — ${SITE_NAME}`,
      description:
        "Learn about KYUB, our process, our team, and how we help brands build memorable identities and digital presence.",
    },
    works: {
      title: `Works — ${SITE_NAME}`,
      description:
        "Explore our portfolio of branding projects, company profiles, and creative campaigns crafted for ambitious brands.",
    },
    contacts: {
      title: `Contacts — ${SITE_NAME}`,
      description:
        "Get in touch with KYUB. Let's talk about your next branding, company profile, or digital project.",
    },
  };

  return configs[page] || configs.home;
}
