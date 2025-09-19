import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/server-actions/auth";
import { RootState } from "../store";

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState: null as User | null,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    updateUser: (state, action: PayloadAction<User>) => {
      console.log("Updating user state with:", action.payload);
      state = action.payload;
      return state;
    },
    removeUser: (state) => {
      state = null;
      return state as User | null;
    },
  },
});
export const { updateUser, removeUser } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const getUser = (state: RootState) => state.user;

export default userSlice.reducer;
