
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import taskService from "../../services/taskService";

const initialState = {
  items: [],
  stats: null,
  recentTasks: [],
  loading: false,
  dashboardLoading: false,
  error: null,
  tasksError: null,
  dashboardError: null,
};

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (filters = {}, thunkAPI) => {
    try {
      const response = await taskService.getTasks(filters);
      return response.tasks;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Could not fetch tasks"
      );
    }
  }
);

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (taskData, thunkAPI) => {
    try {
      const response = await taskService.createTask(taskData);
      return response.task;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Could not create task"
      );
    }
  }
);

export const editTask = createAsyncThunk(
  "tasks/editTask",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await taskService.updateTask({ id, data });
      return response.task;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Could not update task"
      );
    }
  }
);

export const removeTask = createAsyncThunk(
  "tasks/removeTask",
  async (id, thunkAPI) => {
    try {
      await taskService.deleteTask(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Could not delete task"
      );
    }
  }
);

export const fetchDashboard = createAsyncThunk(
  "tasks/fetchDashboard",
  async (_, thunkAPI) => {
    try {
      return await taskService.getDashboard();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Could not load dashboard"
      );
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
    clearTasks: (state) => {
      state.items = [];
      state.stats = null;
      state.recentTasks = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.tasksError = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.tasksError = action.payload;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(editTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (task) => task._id === action.payload._id
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(editTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (task) => task._id !== action.payload
        );
      })
      .addCase(removeTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardError = null;
        state.stats = action.payload.stats;
        state.recentTasks = action.payload.recentTasks;
      })
      .addCase(fetchDashboard.pending, (state) => {
        state.dashboardLoading = true;
        state.dashboardError = null;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardError = action.payload;
      });
  },
});

export const { clearTaskError, clearTasks } = taskSlice.actions;
export default taskSlice.reducer;
