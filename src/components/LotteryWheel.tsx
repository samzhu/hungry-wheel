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
 * 籤條組件（扁平竹片，像真實的籤詩）
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
        position[1] + 0.3,
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

  // 籤支顏色：選中為金黃，hover 為淺黃，默認為竹色
  const stickColor = isSelected ? '#d4af37' : (hovered && phase === DrawPhase.IDLE ? '#e8d5a0' : '#d2b48c')

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* 籤支主體（扁平竹片） */}
      <mesh castShadow>
        <boxGeometry args={[0.12, 2.5, 0.015]} />
        <meshStandardMaterial
          color={stickColor}
          metalness={0}
          roughness={0.7}
        />
      </mesh>

      {/* 籤支頂部圓角 */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial
          color={stickColor}
          metalness={0}
          roughness={0.7}
        />
      </mesh>

      {/* 紅色標記點（在頂部） */}
      {isSelected && (
        <mesh position={[0, 1.1, 0.01]}>
          <circleGeometry args={[0.04, 16]} />
          <meshStandardMaterial
            color="#dc2626"
            metalness={0.2}
            roughness={0.4}
          />
        </mesh>
      )}

      {/* 號碼文字（在籤片上） */}
      <Text
        position={[0, 0.3, 0.01]}
        fontSize={0.15}
        color={isSelected ? '#dc2626' : '#8b4513'}
        anchorX="center"
        anchorY="middle"
      >
        {restaurant.name.substring(0, 2)}
      </Text>

      {/* 餐廳名稱（選中時顯示在旁邊） */}
      {isSelected && phase !== DrawPhase.IDLE && (
        <Text
          position={[0, 2.2, 0]}
          fontSize={0.2}
          color="#ffd700"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.5}
          outlineWidth={0.03}
          outlineColor="#8b4513"
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

  const cylinderRadius = 1.3
  const cylinderHeight = 3.2
  const segments = 6 // 六角形

  // 將籤支排列在籤筒內（隨機分佈）
  const sticksPositions = restaurants.map((_, index) => {
    const angle = (Math.PI * 2 * index) / restaurants.length + Math.random() * 0.5
    const radius = Math.random() * (cylinderRadius - 0.4)
    return [
      Math.cos(angle) * radius,
      -cylinderHeight / 2 + 0.8, // 在籤筒底部
      Math.sin(angle) * radius
    ] as [number, number, number]
  })

  return (
    <group ref={containerRef}>
      {/* 籤筒主體（六角形竹筒） */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[cylinderRadius, cylinderRadius * 0.95, cylinderHeight, segments, 1, true]} />
        <meshStandardMaterial
          color="#a67c52"
          metalness={0}
          roughness={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 籤筒底部（六角形） */}
      <mesh position={[0, -cylinderHeight / 2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[cylinderRadius * 0.95, cylinderRadius * 0.95, 0.1, segments]} />
        <meshStandardMaterial color="#8b6f47" metalness={0} roughness={0.9} />
      </mesh>

      {/* 頂部金色裝飾環 */}
      <mesh position={[0, cylinderHeight / 2 - 0.15, 0]} castShadow>
        <cylinderGeometry args={[cylinderRadius + 0.08, cylinderRadius + 0.08, 0.2, segments]} />
        <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.25} />
      </mesh>

      {/* 頂部紅色裝飾線 */}
      <mesh position={[0, cylinderHeight / 2 - 0.3, 0]}>
        <cylinderGeometry args={[cylinderRadius + 0.02, cylinderRadius + 0.02, 0.08, segments]} />
        <meshStandardMaterial color="#dc2626" metalness={0.4} roughness={0.3} />
      </mesh>

      {/* 底部金色裝飾環 */}
      <mesh position={[0, -cylinderHeight / 2 + 0.15, 0]} castShadow>
        <cylinderGeometry args={[cylinderRadius * 0.98, cylinderRadius * 0.98, 0.2, segments]} />
        <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.25} />
      </mesh>

      {/* 竹節紋理（3個） */}
      {[0.8, 0, -0.8].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <cylinderGeometry args={[cylinderRadius + 0.015, cylinderRadius + 0.015, 0.05, segments]} />
          <meshStandardMaterial color="#8b6f47" metalness={0} roughness={0.8} />
        </mesh>
      ))}

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
      {/* 環境光（暖色調） */}
      <ambientLight intensity={0.7} color="#fff5e6" />

      {/* 主光源（模擬天光） */}
      <directionalLight position={[4, 10, 6]} intensity={1.5} castShadow color="#fffaf0" />
      <directionalLight position={[-4, 5, -6]} intensity={0.6} color="#ffd7a3" />

      {/* 頂部聚光燈（照亮籤筒，神聖感） */}
      <spotLight
        position={[0, 10, 0]}
        angle={0.5}
        penumbra={0.6}
        intensity={2}
        castShadow
        color="#fff8dc"
      />

      {/* 氛圍點光源（紅色燈籠效果） */}
      <pointLight position={[3, 3, 3]} intensity={0.8} color="#ff6b6b" />
      <pointLight position={[-3, 3, -3]} intensity={0.8} color="#ff6b6b" />

      {/* 後方補光（金色氛圍） */}
      <pointLight position={[0, 2, -5]} intensity={0.5} color="#ffd700" />

      {/* 籤筒容器（包含所有籤支） */}
      <LotteryContainer
        restaurants={restaurants}
        selectedIndex={selectedIndex}
        phase={phase}
        onPhaseComplete={onPhaseComplete}
      />

      {/* 地面（深色木質地板） */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
        <planeGeometry args={[25, 25]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={2048}
          mixBlur={1.2}
          mixStrength={40}
          roughness={0.9}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#2d2416"
          metalness={0.3}
        />
      </mesh>

      {/* 環境貼圖（日落氛圍） */}
      <Environment preset="sunset" />

      {/* 霧氣效果 */}
      <fog attach="fog" args={['#1a1410', 10, 25]} />

      {/* 滑鼠控制 */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 6}
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
