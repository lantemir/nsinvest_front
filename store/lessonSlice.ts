import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/axios";
import { stat } from "fs";

interface Lesson {  
  id: number;
  title: string;
  content: string;
  course: number;
  video: string;
  order: string | null;
}

interface LessonState{
    lessons: Lesson[];
    currentLesson: Lesson | null;
    loading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;    
}

const initialState: LessonState = {
    lessons: [],
    currentLesson: null,
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
}

export const fetchLessonsByCourse = createAsyncThunk(
    "lessons/fetchByCourse",
    async(
        {courseId, page = 1}: {courseId: number; page?: number},
        thunkAPI
    ) => {
        try {
            const response = await api.get(
                `/api/lesson/by-course/${courseId}/?page=${page}`
            );            
            return{
                data: response.data.results,
                totalPages: Math.ceil(response.data.count/10),
                currentPage: page,
            };
        }catch(erroe:any){
          
            return thunkAPI.rejectWithValue("Не удалось загрузить уроки")
        }
    }
)

export const fetchLessonById = createAsyncThunk(
    "lessons/fetchById",
    async(
        {lessonId}:{lessonId:number},
        thunkAPI

    ) => {
        try{
            const response =await api.get(
                `/api/lesson/by-id/${lessonId}`
            );
            console.log(response.data)
            return{
                data: response.data,
            }            

        }catch(error:any) {
            return thunkAPI.rejectWithValue("Не удалось загрузить урок")
        }
    }
)

const courseSlice = createSlice({
    name: "lessons",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLessonsByCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLessonsByCourse.fulfilled, (state, action)=> {
                state.loading= false;
                state.error= null;
                state.lessons = action.payload.data
                state.totalPages = action.payload.totalPages
                state.currentPage = action.payload.currentPage
            })
            .addCase(fetchLessonsByCourse.rejected, (state, action)=> {
                state.loading=false;
                state.error=action.payload as string;
            })
            .addCase(fetchLessonById.pending, (state)=>{
                state.loading= true;
                state.error=null
            })
            .addCase(fetchLessonById.fulfilled, (state, action)=> {
                state.loading = false;
                state.error = null;
                state.currentLesson = action.payload.data;
            })
            .addCase(fetchLessonById.rejected, (state,action)=> {
                state.loading = false;
                state.error = action.payload as string;
            })
            
    }
});
export default courseSlice.reducer