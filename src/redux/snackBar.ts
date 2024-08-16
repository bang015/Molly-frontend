import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SnackBarState {
  message: string
  showSnackBar: boolean
}
const initialState: SnackBarState = {
  message: '',
  showSnackBar: false,
}

const snackBarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    openSnackBar: (state, action: PayloadAction<string>) => {
      state.showSnackBar = true
      state.message = action.payload
    },
    closeSnackBar: state => {
      state.showSnackBar = false
      state.message = ''
    },
  },
})

export const { openSnackBar, closeSnackBar } = snackBarSlice.actions
export default snackBarSlice.reducer
