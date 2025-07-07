import ChatInput from '../components/ChatInput'
import Carousel from '../components/Carousel'
import Spline from '@splinetool/react-spline'

const HomePage = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-1 w-full justify-center items-end relative min-h-[700px]">
          <div className="absolute top-[10px] left-0 right-0 z-10 flex justify-center">
            <Carousel />
          </div>
          <Spline className='pointer-events-none max-h-[1900px] max-w-[4600px] absolute top-[-75px]' scene="https://prod.spline.design/U4pluEHM1r2eie-d/scene.splinecode"/>
        <div className="absolute z-20 bottom-0 left-0 right-0 flex justify-center">
          <ChatInput />
        </div>
      </div>
    </div>
  )
}

export default HomePage