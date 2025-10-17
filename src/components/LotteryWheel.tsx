import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Text, MeshReflectorMaterial } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { Restaurant } from '../types/restaurant'

interface LotteryWheelProps {
  restaurants: Restaurant[]
  onDraw?: (restaurant: Restaurant) => void
}

/**
 * 抽籤階段
 */
enum DrawPhase {
  IDLE = 'idle',           // 待機
  SHAKING = 'shaking',     // 搖籤筒
  RISING = 'rising',       // 籤支浮起
  FLYING = 'flying',       // 飛向鏡頭
  COMPLETE = 'complete'    // 完成
}

/**
 * 籤條 3D 卡片組件（垂直籤支，像真實的竹籤）
 */
function LotteryStick({
  restaurant,
  position,
  isSelected = false,
  phase = DrawPhase.IDLE
}: {
  restaurant: Restaurant
  position: [number, number, number]
  isSelected?: boolean
  phase?: DrawPhase
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (groupRef.current && hovered && phase === DrawPhase.IDLE) {
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        position[1] + 0.2,
        0.1
      )
    } else if (groupRef.current && !isSelected) {
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        position[1],
        0.1
      )
    }
  })

  // 籤支顏色：選中為金色，hover 為粉紅，默認為木色
  const stickColor = isSelected ? '#fbbf24' : (hovered && phase === DrawPhase.IDLE ? '#f093fb' : '#d4a574')

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 籤支主體（細長圓柱，像竹籤） */}
      <mesh>
        <cylinderGeometry args={[0.02, 0.02, 3, 8]} />
        <meshStandardMaterial
          color={stickColor}
          metalness={0.1}
          roughness={0.6}
        />
      </mesh>

      {/* 籤支頂部標記（小球） */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial
          color={isSelected ? '#ef4444' : '#8b4513'}
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>

      {/* 餐廳名稱（只在選中時顯示） */}
      {isSelected && phase !== DrawPhase.IDLE && (
        <Text
          position={[0, 2, 0]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {restaurant.name}
        </Text>
      )}
    </group>
  )
}

/**
 * 籤筒組件（包含籤筒和籤支）
 */
function LotteryContainer({
  restaurants,
  selectedIndex,
  phase,
  onPhaseComplete
}: {
  restaurants: Restaurant[]
  selectedIndex: number
  phase: DrawPhase
  onPhaseComplete?: (newPhase: DrawPhase) => void
}) {
  const containerRef = useRef<THREE.Group>(null)
  const selectedStickRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // 階段 1: 搖籤筒
    if (phase === DrawPhase.SHAKING) {
      console.log('🔔 開始搖籤筒')
      const tl = gsap.timeline({
        onComplete: () => {
          console.log('✅ 搖籤筒完成')
          if (onPhaseComplete) onPhaseComplete(DrawPhase.RISING)
        }
      })

      // 左右搖晃 + 前後搖晃（2.5秒）
      tl.to(containerRef.current.rotation, {
        x: 0.3,
        z: 0.2,
        duration: 0.15,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 7
      })
      tl.to(containerRef.current.rotation, {
        x: -0.2,
        z: -0.3,
        duration: 0.15,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: 7
      }, '<0.075')
      // 回正
      tl.to(containerRef.current.rotation, {
        x: 0,
        z: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)'
      })
    }

    // 階段 2: 籤支浮起
    if (phase === DrawPhase.RISING && selectedStickRef.current) {
      console.log('📤 籤支開始浮起')
      gsap.to(selectedStickRef.current.position, {
        y: 3, // 浮到籤筒上方
        duration: 2,
        ease: 'power2.out',
        onComplete: () => {
          console.log('✅ 籤支浮起完成')
          if (onPhaseComplete) onPhaseComplete(DrawPhase.FLYING)
        }
      })
    }

    // 階段 3: 飛向鏡頭
    if (phase === DrawPhase.FLYING && selectedStickRef.current) {
      console.log('🚀 籤支飛向鏡頭')
      const tl = gsap.timeline({
        onComplete: () => {
          console.log('✅ 動畫完成')
          if (onPhaseComplete) onPhaseComplete(DrawPhase.COMPLETE)
        }
      })

      tl.to(selectedStickRef.current.position, {
        z: 6, // 飛向鏡頭
        y: 2,
        duration: 1.2,
        ease: 'power2.in'
      })
      tl.to(selectedStickRef.current.rotation, {
        y: Math.PI * 2,
        duration: 1.2,
        ease: 'power2.in'
      }, '<')
      tl.to(selectedStickRef.current.scale, {
        x: 2,
        y: 2,
        z: 2,
        duration: 1.2,
        ease: 'power2.in'
      }, '<')
    }
  }, [phase, onPhaseComplete])

  // 閒置時緩慢浮動
  useFrame(({ clock }) => {
    if (containerRef.current && phase === DrawPhase.IDLE) {
      containerRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1
    }
  })

  const cylinderRadius = 1.2
  const cylinderHeight = 3

  // 將籤支排列在籤筒內（隨機分佈）
  const sticksPositions = restaurants.map((_, index) => {
    const angle = (Math.PI * 2 * index) / restaurants.length + Math.random() * 0.5
    const radius = Math.random() * (cylinderRadius - 0.3)
    return [
      Math.cos(angle) * radius,
      -cylinderHeight / 2 + 0.5, // 在籤筒底部
      Math.sin(angle) * radius
    ] as [number, number, number]
  })

  return (
    <group ref={containerRef}>
      {/* 籤筒主體 */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[cylinderRadius, cylinderRadius * 0.9, cylinderHeight, 32, 1, true]} />
        <meshStandardMaterial
          color="#8b4513"
          metalness={0.1}
          roughness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 籤筒底部 */}
      <mesh position={[0, -cylinderHeight / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[cylinderRadius * 0.9, 32]} />
        <meshStandardMaterial color="#654321" metalness={0.1} roughness={0.9} />
      </mesh>

      {/* 籤筒裝飾環 */}
      <mesh position={[0, cylinderHeight / 2 - 0.2, 0]}>
        <cylinderGeometry args={[cylinderRadius + 0.05, cylinderRadius + 0.05, 0.15, 32]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -cylinderHeight / 2 + 0.2, 0]}>
        <cylinderGeometry args={[cylinderRadius, cylinderRadius, 0.15, 32]} />
        <meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* 所有籤支 */}
      {restaurants.map((restaurant, index) => {
        const isSelected = index === selectedIndex
        return (
          <group
            key={restaurant.id}
            ref={isSelected ? selectedStickRef : undefined}
          >
            <LotteryStick
              restaurant={restaurant}
              position={sticksPositions[index]}
              isSelected={isSelected}
              phase={phase}
            />
          </group>
        )
      })}
    </group>
  )
}


/**
 * 3D 場景
 */
function Scene({
  restaurants,
  selectedIndex,
  phase,
  onPhaseComplete
}: {
  restaurants: Restaurant[]
  selectedIndex: number
  phase: DrawPhase
  onPhaseComplete?: (newPhase: DrawPhase) => void
}) {
  return (
    <>
      {/* 環境光 */}
      <ambientLight intensity={0.6} />

      {/* 主光源 */}
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.4} />

      {/* 頂部聚光燈（照亮籤筒） */}
      <spotLight
        position={[0, 8, 0]}
        angle={0.6}
        penumbra={0.5}
        intensity={1.5}
        castShadow
        color="#fff8dc"
      />

      {/* 氛圍點光源 */}
      <pointLight position={[3, 2, 3]} intensity={0.5} color="#f093fb" />
      <pointLight position={[-3, 2, -3]} intensity={0.5} color="#667eea" />

      {/* 籤筒容器（包含所有籤支） */}
      <LotteryContainer
        restaurants={restaurants}
        selectedIndex={selectedIndex}
        phase={phase}
        onPhaseComplete={onPhaseComplete}
      />

      {/* 地面反射 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={30}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#1a1a2e"
          metalness={0.5}
        />
      </mesh>

      {/* 環境貼圖 */}
      <Environment preset="sunset" />

      {/* 滑鼠控制 */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={4}
        maxDistance={12}
        maxPolarAngle={Math.PI / 2.2}
        enabled={phase === DrawPhase.IDLE} // 抽籤時禁用控制
      />
    </>
  )
}

/**
 * 載入中 Fallback
 */
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#667eea" />
    </mesh>
  )
}

/**
 * 3D 抽籤輪盤主組件
 */
export const LotteryWheel = ({ restaurants, onDraw }: LotteryWheelProps) => {
  const [phase, setPhase] = useState<DrawPhase>(DrawPhase.IDLE)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handlePhaseComplete = (newPhase: DrawPhase) => {
    console.log(`📌 階段切換: ${phase} → ${newPhase}`)
    setPhase(newPhase)

    // 抽籤完成，通知父組件
    if (newPhase === DrawPhase.COMPLETE && onDraw && restaurants.length > 0) {
      setTimeout(() => {
        onDraw(restaurants[selectedIndex])
      }, 500) // 稍微延遲，讓動畫完整播放
    }
  }

  const handleStartDraw = () => {
    // 隨機選擇一支籤
    const randomIndex = Math.floor(Math.random() * restaurants.length)
    setSelectedIndex(randomIndex)
    setPhase(DrawPhase.SHAKING)

    console.log(`🎯 抽中第 ${randomIndex} 支籤: ${restaurants[randomIndex].name}`)

    // 按鈕點擊動畫
    if (buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        { scale: 1 },
        {
          scale: 0.9,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
        }
      )
    }
  }

  // 獲取按鈕文字
  const getButtonText = () => {
    switch (phase) {
      case DrawPhase.IDLE:
        return '🙏 開始抽籤'
      case DrawPhase.SHAKING:
        return '📳 搖籤中...'
      case DrawPhase.RISING:
        return '✨ 籤支浮起...'
      case DrawPhase.FLYING:
        return '🎊 揭曉中...'
      case DrawPhase.COMPLETE:
        return '✅ 完成'
      default:
        return '開始抽籤'
    }
  }

  const isDrawing = phase !== DrawPhase.IDLE && phase !== DrawPhase.COMPLETE

  return (
    <div className="lottery-wheel-container">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 50 }}
        gl={{ antialias: true }}
        shadows
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene
            restaurants={restaurants}
            selectedIndex={selectedIndex}
            phase={phase}
            onPhaseComplete={handlePhaseComplete}
          />
        </Suspense>
      </Canvas>

      <button
        ref={buttonRef}
        className="spin-button"
        onClick={handleStartDraw}
        disabled={isDrawing}
      >
        {getButtonText()}
      </button>
    </div>
  )
}
