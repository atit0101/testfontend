"use client";

import { NextSSRInMemoryCache } from "@apollo/experimental-nextjs-app-support/ssr";
import { cacheExchange, createClient, fetchExchange, ssrExchange } from "urql";

const isServerSide = typeof window === 'undefined';
const ssrCache = ssrExchange({
  isClient: !isServerSide,
});

const client = createClient({
  url: 'https://countries.trevorblades.com/',
  exchanges: [cacheExchange, fetchExchange],
});


export const QueryCountries = (code: string) => {
  return  `
  query {
    continent(code: "${code}") {
      code,
      name,
      countries {
        name,
        code,
        emoji,
        emojiU
      }
    }
  }
`;
};

export { client, ssrCache };
