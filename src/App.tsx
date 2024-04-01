import { useState } from 'react'

import { ticket } from '@/lib/ticketyInit'
import ChatBox from './components/chatbox';

function App() {
 

  return (
    <div  className='bg-slate-600'>
      <div>
       <ChatBox/>
      </div>
    </div>
  );
}

export default App
