# Md. Abu Musa — Portfolio

Personal portfolio built with Next.js (App Router), TypeScript and Tailwind CSS, exported as a static site.

Live: https://abumusa-portfolio.web.app · https://amsohag007.github.io

## Develop

```bash
npm install
npm run dev
```

Content lives in `data/profile.ts`; images in `public/images/`.

## Build and deploy

```bash
npm run build        # static export to out/
firebase deploy      # Firebase Hosting (serves out/)
```

The same `out/` folder is published to the `amsohag007.github.io` repository for GitHub Pages.
