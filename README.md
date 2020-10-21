# MobX React Typed Injection

A better, fully typed injector HOC to use with MobX and React.

## !!! Deprecated !!!
This package is deprecated in favor of using MobX with hooks instead.

## Benefits

- The inject function "knows" your stores, so you'll have proper TS code completion and warnings for non-matching types
- Build time errors when trying to use props that are already injected
- No need to add one more context provider to your app root

## Install it

```
yarn add mobx-react-typed-injection
```

### Use it

1. Somewhere in your project, create a `stores.ts` file, exporting `inject` and `withFakeStores` (to be used on tests):

   ```typescript
   import { createStateManager } from 'mobx-react-typed-injection'

   import search from 'path/to/searchStore'
   import movieDetails from 'path/to/movieDetailsStore'
   import somethingElse from 'path/to/somethingElseStore'

   export const { inject, withFakeStores } = createStateManager({
     search,
     movieDetails,
     somethingElse,
   })
   ```

2. Inject something from the stores into a dumb component:

   ```typescript jsx
   import { inject } from 'path/to/stores'

   const _MovieHeader = (props: { title: string; releaseYear: number; poster: string; somethingElse: string }) => {
     return (
       <div>
         <img src={props.poster} alt="Movie Poster" />
         <div>{props.title}</div>
         <div>{props.releaseYear}</div>
       </div>
     )
   }

   export const MovieHeader = inject(({ movieDetails }) => ({
     title: movieDetails.title,
     releaseYear: movieDetails.releaseYear,
     poster: movieDetails.posters[0],
   }), _MovieHeader)
   ```

3. Use your injected component:

   ```typescript jsx
   // Works fine for non injected props
   <MovieHeader somethingElse="lorem ipsum"/>

   // TS error for props already injected
   <MovieHeader title="lorem ipsum"/>
   ```
