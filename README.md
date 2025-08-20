# Weather App

Small React + Vite + Tailwind app that shows a 5-day forecast from OpenWeather. City search is debounced; requests are cancellable; cards use skeleton loading.

## Quick Start

```bash
npm i
npm run dev
# npm run build  # typecheck + build
# npm run preview
# npm run lint
```

## API Key

The API key is defined in **constants**, not in a local env file:

I know sharing an API key in code isn’t best practice and should normally be kept in an environment file that’s ignored by Git. For this demo it doesn’t affect anything because the key is 100% free for me.

