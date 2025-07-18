import ChatInput from '../components/ChatInput'
import Spline from '@splinetool/react-spline'
import Tile from '../components/Tile'

const HomePage = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-1 w-full justify-center items-end relative min-h-[700px]">
        {/* Tiles positioned as in Figma */}
        <div className="absolute left-1/2 z-10 flex flex-col items-center gap-8" style={{top: '60px', transform: 'translateX(-120%)'}}>
          <Tile
            title="AI SHARING"
            iconPath="/images/logo1.png"
            imagePath="/images/tile1.png"
            top="0px"
          />
          <Tile
            title="AIVAR STORE"
            iconPath="/images/logo2.png"
            imagePath="/images/tile2.png"
            top="-320px"
            right="-520px"
          />
          <Tile
            title="AIVAR METALAND"
            iconPath="/images/logo3.png"
            imagePath="/images/tile3.png"
            top="-10px"
            right="0px"

          />
          <Tile
            title="CFX QUANTUM"
            iconPath="/images/logo4.png"
            imagePath="/images/tile4.png"
            top="-320px"
            right="-520px"
          />
          <Tile
            title="VAFFA GAME"
            iconPath="/images/logo5.png"
            imagePath="/images/tile5.png"
            top="0px"
            right="-250px"
          />
        </div>
        <div className="absolute top-[10px] left-0 right-0 z-10 flex justify-center">
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