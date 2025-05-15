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

export const fetchLessonsByCourse = createAsyncThunk<
// тип результата при fulfilled
{
    data: Lesson[];
    totalPages: number;
    currentPage: number;
  },
  // аргумент
  { courseId: number; page?: number },
  // thunkAPI тип (в частности, для rejectWithValue)
  {
    rejectValue: string;
  }
>(
    
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
                totalPages: Math.ceil(response.data.count/response.data.page_size),
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
    reducers: {
        resetLessons(state) {
            state.lessons=[];
            state.currentLesson = null;
            state.error= null;
            state.loading= false;
        }
    },
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
                state.error=action.payload ?? "Произошла ошибка";
                state.lessons = []
                state.currentLesson = null
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
                state.currentLesson = null
            })
            
    }
});
export const { resetLessons } = courseSlice.actions;
export default courseSlice.reducer