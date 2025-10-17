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
 * 籤條 3D 卡片組件
 */
function LotteryStick({
  restaurant,
  position,
  rotation
}: {
  restaurant: Restaurant
  position: [number, number, number]
  rotation: [number, number, number]
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (meshRef.current && hovered) {
      meshRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1)
    } else if (meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
    }
  })

  return (
    <group position={position} rotation={rotation}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* 籤條主體 */}
        <boxGeometry args={[2, 0.3, 0.05]} />
        <meshStandardMaterial
          color={hovered ? '#f093fb' : '#ffffff'}
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>

      {/* 餐廳名稱文字 */}
      <Text
        position={[0, 0, 0.03]}
        fontSize={0.12}
        color="#333333"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
      >
        {restaurant.name}
      </Text>

      {/* 評分 */}
      {restaurant.rating && (
        <Text
          position={[0, -0.08, 0.03]}
          fontSize={0.08}
          color="#f59e0b"
          anchorX="center"
          anchorY="middle"
        >
          ⭐ {restaurant.rating.toFixed(1)}
        </Text>
      )}
    </group>
  )
}

/**
 * 圓柱形籤筒組件
 */
function LotteryCylinder({ radius = 3, height = 4 }) {
  const cylinderRef = useRef<THREE.Mesh>(null)

  return (
    <mesh ref={cylinderRef} position={[0, 0, 0]}>
      <cylinderGeometry args={[radius, radius, height, 32, 1, true]} />
      <meshStandardMaterial
        color="#667eea"
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
        metalness={0.3}
        roughness={0.7}
      />
    </mesh>
  )
}

/**
 * 旋轉的籤條組
 */
function RotatingSticks({
  restaurants,
  isSpinning,
  onSpinComplete
}: {
  restaurants: Restaurant[]
  isSpinning: boolean
  onSpinComplete?: () => void
}) {
  const groupRef = useRef<THREE.Group>(null)
  const rotationSpeed = useRef(0.2)
  const animationData = useRef({ speed: 0.2 })

  useEffect(() => {
    if (isSpinning && groupRef.current) {
      console.log('🎲 開始抽籤動畫')

      // 重置速度
      animationData.current.speed = 0.2
      rotationSpeed.current = 0.2

      // GSAP 動畫：先加速再減速
      gsap.to(animationData.current, {
        speed: 10, // 加速到最快
        duration: 0.5,
        ease: 'power2.in',
        onUpdate: () => {
          rotationSpeed.current = animationData.current.speed
        },
        onComplete: () => {
          console.log('⚡ 加速完成，開始減速')
          // 然後減速
          gsap.to(animationData.current, {
            speed: 0,
            duration: 2.5,
            ease: 'power4.out',
            onUpdate: () => {
              rotationSpeed.current = animationData.current.speed
            },
            onComplete: () => {
              console.log('✅ 動畫完成')
              if (onSpinComplete) {
                onSpinComplete()
              }
            }
          })
        }
      })
    }
  }, [isSpinning, onSpinComplete])

  useFrame((_state, delta) => {
    if (groupRef.current) {
      if (isSpinning && rotationSpeed.current > 0.1) {
        // 旋轉中
        groupRef.current.rotation.y += delta * rotationSpeed.current
      } else if (!isSpinning) {
        // 閒置時緩慢旋轉
        groupRef.current.rotation.y += delta * 0.2
      }
    }
  })

  const radius = 3
  const angleStep = (Math.PI * 2) / restaurants.length

  return (
    <group ref={groupRef}>
      {restaurants.map((restaurant, index) => {
        const angle = angleStep * index
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius

        return (
          <LotteryStick
            key={restaurant.id}
            restaurant={restaurant}
            position={[x, 0, z]}
            rotation={[0, -angle, 0]}
          />
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
  isSpinning,
  onSpinComplete
}: {
  restaurants: Restaurant[]
  isSpinning: boolean
  onSpinComplete?: () => void
}) {
  return (
    <>
      {/* 環境光 */}
      <ambientLight intensity={0.5} />

      {/* 主光源 */}
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />

      {/* 點光源（動態效果） */}
      <pointLight position={[0, 5, 0]} intensity={0.8} color="#f093fb" />

      {/* 籤筒 */}
      <LotteryCylinder radius={3} height={4} />

      {/* 籤條組 */}
      <RotatingSticks
        restaurants={restaurants}
        isSpinning={isSpinning}
        onSpinComplete={onSpinComplete}
      />

      {/* 地面反射 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={40}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#151515"
          metalness={0.5}
        />
      </mesh>

      {/* 環境貼圖 */}
      <Environment preset="sunset" />

      {/* 滑鼠控制 */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
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
  const [isSpinning, setIsSpinning] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleSpinComplete = () => {
    setIsSpinning(false)
    if (onDraw && restaurants.length > 0) {
      const randomIndex = Math.floor(Math.random() * restaurants.length)
      onDraw(restaurants[randomIndex])
    }
  }

  const handleSpin = () => {
    setIsSpinning(true)

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
            isSpinning={isSpinning}
            onSpinComplete={handleSpinComplete}
          />
        </Suspense>
      </Canvas>

      <button
        ref={buttonRef}
        className="spin-button"
        onClick={handleSpin}
        disabled={isSpinning}
      >
        {isSpinning ? '抽籤中...' : '開始抽籤'}
      </button>
    </div>
  )
}
