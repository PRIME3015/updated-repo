import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import  AppLayout from './layouts/AppLayout';
import LandingPage from './Pages/LandingPage';
import Job from './Pages/Job';
import MyJobs from './Pages/MyJobs';
import JobListing from './Pages/jobListing';
import PostJobs from './Pages/PostJobs';
import SavedJobs from './Pages/SavedJobs';
import OnBoarding from './Pages/OnBoarding';
import Application from './components/applications';
import Protected_route from './components/Protected_route';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/OnBoarding",
        element: (
          <Protected_route>
            <OnBoarding />
          </Protected_route>
        ),
      },
      {
        path: "/jobs",
        element: (
          <Protected_route>
            <JobListing />
          </Protected_route>
        ),
      },

      ,
      {
        path: "/Job/:id",
        element: (
          <Protected_route>
            <Job />
          </Protected_route>
        ),
      },
      {
        path: "/MyJobs",
        element: (
          <Protected_route>
            <MyJobs />
          </Protected_route>
        ),
      },
      {
        path: "/JobListing",
        element: (
          <Protected_route>
            <JobListing />
          </Protected_route>
        ),
      },
      {
        path: "/PostJobs",
        element: (
          <Protected_route>
            <PostJobs />
          </Protected_route>
        ),
      },
      {
        path: "/SavedJobs",
        element: (
          <Protected_route>
            <SavedJobs />
          </Protected_route>
        ),
      },
      {
        path:"/Applications",
        element:(
          <Protected_route>
<          Application/>
          </Protected_route>
        )
      }
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router}/>
  )
}

export default App
