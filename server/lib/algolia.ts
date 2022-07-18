import algoliasearch from "algoliasearch";
const client = algoliasearch(
	process.env.ALGOLIA_ID,
	process.env.ALGOLIA_API_KEY
);

export const petsIndex = client.initIndex("pets");
