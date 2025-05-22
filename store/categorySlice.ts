import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/axios";

export interface Category{
    id: number;
    name: string;
    order: number;
    path: string;
    slug: string;
}


interface CategoryState {
    categories: Category[];
    loading: boolean;
    error: string | null;    
}

const initialState: CategoryState = {
    categories: [],
    loading: false,
    error: null
}


export const fetchCategories = createAsyncThunk("categories/fetch", async (_, thunkApi) => {
    try{
        const response = await api.get("api/categories/");
        console.log("responsefetchCategories@@@", response)
        return response?.data
    }catch (erroe:any) {
        console.log("Не удалось загрузить")
        return thunkApi.rejectWithValue("Не удалось загрузить категории")
    }
});



const categorySlice = createSlice({
    name: "categories",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) =>{
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action)=> {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default categorySlice.reducer;