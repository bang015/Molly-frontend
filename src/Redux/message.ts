import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { socket } from "./auth";



export const createChatRoom = createAsyncThunk