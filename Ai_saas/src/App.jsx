import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Layout from './Pages/Layout'
import Dashboard from './Pages/Dashboard'
import WriteArticle from './Pages/WriteArticle'
import Blogtitle from './Pages/Blogtitle'
import GenerateImages from './Pages/GenerateImages'
import RemoveBackgroung from './Pages/RemoveBackgroung'
import RemoveObject from './Pages/RemoveObject'
import ReviewResume from './Pages/ReviewResume'
import Community from './Pages/Community'
import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'
import {Toaster} from 'react-hot-toast'


const App = () => {


  return (
    <div>
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/ai' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='write-article' element={<WriteArticle />} />
          <Route path='blog-title' element={<Blogtitle />} />
          <Route path='generate-image' element={<GenerateImages />} />
          <Route path='remove-backgroung' element={<RemoveBackgroung />} />
          <Route path='remove-object' element={<RemoveObject />} />
          <Route path='review-resume' element={<ReviewResume />} />
          <Route path='community' element={<Community />} />
          
        </Route>
      </Routes>
    </div>
  )
}

export default App
