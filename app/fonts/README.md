# Bundled fonts

These Latin WOFF2 files are the Google Fonts assets used by the original invitation. They are bundled to avoid the Turbopack Google-font query-resolution error and eliminate build-time font downloads.

- Cormorant Garamond: normal and italic, variable weights 400–600 used by this app.
- Montserrat: normal, variable weights 400–600 used by this app.
- Great Vibes: normal, weight 400.

The corresponding SIL Open Font License notices are included beside the files. Upstream sources: [Cormorant Garamond](https://github.com/google/fonts/tree/main/ofl/cormorantgaramond), [Montserrat](https://github.com/google/fonts/tree/main/ofl/montserrat), [Great Vibes](https://github.com/google/fonts/tree/main/ofl/greatvibes).

The loader in `app/layout.tsx` retains the existing CSS font variables, preloading and `font-display: swap`.
