import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/axios";

interface Course {
  id: number;
  title: string;
  description: string;
  category: number;
  author: number;
  created_at: string;
  thumbnail: string | null;
}

interface CourseState{
    courses: Course[];
    loading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;    
}

const initialState: CourseState = {
    courses: [],
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
}

export const fetchCoursesByCategory = createAsyncThunk(
    "courses/fetchByCategory",
    async(
        {categoryId, page = 1, search = ""}: {categoryId: number; page?: number; search?: string},
        thunkAPI
    ) => {
        try {
            const response = await api.get(
                `/api/courses/by-category/${categoryId}/?page=${page}&search=${search}`
            );
            console.log("fetchCoursesByCategory@@@" , response)
            return{
                data: response.data.results,
                totalPages: Math.ceil(response.data.count/response.data.page_size),
                currentPage: page,
            };
        }catch(erroe:any){
            console.log("fetchCoursesByCategory@@@" , "Не удалось загрузить курсы")
            return thunkAPI.rejectWithValue("Не удалось загрузить курсы")
        }
    }
)

export const fetchCoursesByName = createAsyncThunk(
    "courses/fetchByCategoryByName",
    async(
        {categoryName, page = 1, search = ""}: {categoryName: string; page?: number; search?: string},
        thunkAPI
    ) => {
        try {
            const response = await api.get(
                `/api/courses/by-category-name/${categoryName}/?page=${page}&search=${search}`
            );
            console.log("fetchCoursesByName@@@" , response)
            return{
                data: response.data.results,
                totalPages: Math.ceil(response.data.count/response.data.page_size),
                currentPage: page,
            };
        }catch(erroe:any){
            console.log("fetchCoursesByName@@@" , "Не удалось загрузить курсы")
            return thunkAPI.rejectWithValue("Не удалось загрузить курсы")
        }
    }
)


const courseSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {
        resetCourses(state) {
            state.courses = [];
            state.error = null;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoursesByCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCoursesByCategory.fulfilled, (state, action)=> {
                state.loading= false;
                state.error= null;
                state.courses = action.payload.data
                state.totalPages = action.payload.totalPages
                state.currentPage = action.payload.currentPage
            })
            .addCase(fetchCoursesByCategory.rejected, (state, action)=> {
                state.loading=false;
                state.error=action.payload as string;
            })
            .addCase(fetchCoursesByName.fulfilled, (state, action) => {
                state.loading= false;
                state.error= null;
                state.courses = action.payload.data;
                state.totalPages = action.payload.totalPages
                state.currentPage = action.payload.currentPage
            })
            .addCase(fetchCoursesByName.rejected, (state, action)=> {
                state.loading=false;
                state.error=action.payload as string;
                state.courses = [];
            })
    }
});
export const { resetCourses } = courseSlice.actions;
export default courseSlice.reducer