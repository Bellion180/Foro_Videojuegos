import { Component, type OnInit, HostListener, type ElementRef, ViewChild, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ThemeService } from "../../services/theme.service"
import type { Subscription } from "rxjs"

@Component({
  selector: "app-animated-background",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animated-background">
      <canvas #backgroundCanvas class="background-canvas"></canvas>
      <div class="gradient-overlay" [class.dark]="isDarkTheme"></div>
    </div>
  `,
  styles: [
    `
    .animated-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      overflow: hidden;
    }
    
    .background-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    
    .gradient-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, 
                  rgba(126, 34, 206, 0.05) 0%, 
                  rgba(249, 115, 22, 0.05) 50%, 
                  rgba(56, 189, 248, 0.05) 100%);
      animation: gradientShift 20s infinite alternate ease-in-out;
      background-size: 400% 400%;
    }

    .gradient-overlay.dark {
      background: linear-gradient(135deg, 
                  rgba(168, 85, 247, 0.05) 0%, 
                  rgba(251, 146, 60, 0.05) 50%, 
                  rgba(56, 189, 248, 0.05) 100%);
    }
    
    @keyframes gradientShift {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
  `,
  ],
})
export class AnimatedBackgroundComponent implements OnInit, OnDestroy {
  @ViewChild("backgroundCanvas", { static: true }) canvas!: ElementRef<HTMLCanvasElement>
  private ctx!: CanvasRenderingContext2D
  private particles: Particle[] = []
  private mouseX = 0
  private mouseY = 0
  private animationFrameId = 0
  private lastTime = 0
  public isDarkTheme = false
  private themeSubscription!: Subscription

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.initCanvas()
    this.createParticles()
    this.animate(0)

    // Establecer posición inicial del mouse en el centro
    this.mouseX = window.innerWidth / 2
    this.mouseY = window.innerHeight / 2

    // Suscribirse a cambios de tema
    this.themeSubscription = this.themeService.theme$.subscribe((theme) => {
      this.isDarkTheme = theme === "dark"
      this.createParticles() // Recrear partículas con colores apropiados
    })
  }

  @HostListener("window:mousemove", ["$event"])
  onMouseMove(event: MouseEvent) {
    this.mouseX = event.clientX
    this.mouseY = event.clientY
  }

  @HostListener("window:resize")
  onResize() {
    this.resizeCanvas()
    this.createParticles()
  }

  private initCanvas() {
    this.ctx = this.canvas.nativeElement.getContext("2d")!
    this.resizeCanvas()
  }

  private resizeCanvas() {
    this.canvas.nativeElement.width = window.innerWidth
    this.canvas.nativeElement.height = window.innerHeight
  }

  private createParticles() {
    this.particles = []
    const particleCount = Math.min(Math.floor(window.innerWidth / 20), 100)

    const lightColors = [
      "rgba(126, 34, 206, 0.3)", // Primary (purple)
      "rgba(249, 115, 22, 0.3)", // Secondary (orange)
      "rgba(56, 189, 248, 0.3)", // Light blue
      "rgba(16, 185, 129, 0.3)", // Green
    ]

    const darkColors = [
      "rgba(168, 85, 247, 0.3)", // Primary light (purple)
      "rgba(251, 146, 60, 0.3)", // Secondary light (orange)
      "rgba(56, 189, 248, 0.3)", // Light blue
      "rgba(16, 185, 129, 0.3)", // Green
    ]

    const colors = this.isDarkTheme ? darkColors : lightColors

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: Math.random() * 0.5 - 0.25,
        vy: Math.random() * 0.5 - 0.25,
        originalX: Math.random() * window.innerWidth,
        originalY: Math.random() * window.innerHeight,
      })
    }
  }

  private animate(timestamp: number) {
    const deltaTime = timestamp - this.lastTime
    this.lastTime = timestamp

    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)

    // Actualizar y dibujar partículas
    this.updateParticles(deltaTime)
    this.drawParticles()

    // Dibujar conexiones entre partículas cercanas
    this.drawConnections()

    this.animationFrameId = requestAnimationFrame((time) => this.animate(time))
  }

  private updateParticles(deltaTime: number) {
    const mouseInfluenceRadius = 150
    const returnForce = 0.01

    this.particles.forEach((particle) => {
      // Calcular distancia al mouse
      const dx = this.mouseX - particle.x
      const dy = this.mouseY - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Si está dentro del radio de influencia, alejar del mouse
      if (distance < mouseInfluenceRadius) {
        const force = (mouseInfluenceRadius - distance) / mouseInfluenceRadius
        particle.vx -= (dx / distance) * force * 0.2
        particle.vy -= (dy / distance) * force * 0.2
      }

      // Fuerza de retorno a la posición original
      particle.vx += (particle.originalX - particle.x) * returnForce
      particle.vy += (particle.originalY - particle.y) * returnForce

      // Aplicar fricción
      particle.vx *= 0.98
      particle.vy *= 0.98

      // Actualizar posición
      particle.x += particle.vx
      particle.y += particle.vy

      // Mantener dentro de los límites
      if (particle.x < 0) particle.x = 0
      if (particle.x > window.innerWidth) particle.x = window.innerWidth
      if (particle.y < 0) particle.y = 0
      if (particle.y > window.innerHeight) particle.y = window.innerHeight
    })
  }

  private drawParticles() {
    this.particles.forEach((particle) => {
      this.ctx.beginPath()
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
      this.ctx.fillStyle = particle.color
      this.ctx.fill()
    })
  }

  private drawConnections() {
    const maxDistance = 150
    const baseColor = this.isDarkTheme ? "rgba(168, 85, 247," : "rgba(126, 34, 206,"

    this.ctx.strokeStyle = baseColor + " 0.1)"
    this.ctx.lineWidth = 1

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x
        const dy = this.particles[i].y - this.particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance) {
          this.ctx.beginPath()
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y)
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y)

          // Opacidad basada en la distancia
          const opacity = 1 - distance / maxDistance
          this.ctx.strokeStyle = `${baseColor} ${opacity * 0.2})`

          this.ctx.stroke()
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }

    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe()
    }
  }
}

interface Particle {
  x: number
  y: number
  radius: number
  color: string
  vx: number
  vy: number
  originalX: number
  originalY: number
}
