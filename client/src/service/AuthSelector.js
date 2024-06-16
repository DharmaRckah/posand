import { createSelector } from '@reduxjs/toolkit';

export const selectAuth = (state) => console.log(state.user);

export const selectToken = createSelector(
  [selectAuth],
  (auth) => auth.token
);
