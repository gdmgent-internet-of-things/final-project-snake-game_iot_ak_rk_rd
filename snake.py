import pygame, sys
import random
from pygame.math import Vector2

class SNAKE:
    def __init__(self):
      self.body = [Vector2(5,10),Vector2(4,10),Vector2(3,10)]
      self.direction = Vector2(1,0)
      self.new_block = False

    def draw_snake(self):
      for block in self.body:
         x_position = int(block.x*cell_size)
         y_position = int(block.y*cell_size)
         block_rect = pygame.Rect(x_position, y_position,cell_size,cell_size)
         pygame.draw.rect(screen,(92,128,27),block_rect)

    def move_snake(self):
      if self.new_block == True: 
          body_copy = self.body[:]
          body_copy.insert(0,body_copy[0] + self.direction)
          self.body = body_copy[:]
          self.new_block = False
      else:
          body_copy = self.body[:-1]
          body_copy.insert(0,body_copy[0] + self.direction)
          self.body = body_copy[:]

    def add_block(self):
       self.new_block = True

class DOT:
    def __init__(self):
      self.randomize()

    def draw_dot(self):
      dot_circle = pygame.Rect(int(self.pos.x * cell_size),int(self.pos.y * cell_size),cell_size,cell_size)
      pygame.draw.rect(screen,(241,102,14), dot_circle)  

    def randomize(self):
        #random plaats dot
        self.x = random.randint(0, cell_number - 1)
        self.y = random.randint(0, cell_number - 1)
        self.pos = pygame.math.Vector2(self.x, self.y)    

class MAIN:
    def __init__(self):
      self.snake = SNAKE()
      self.dot = DOT()

    def update(self):
       self.snake.move_snake()
       self.check_collusion()
       self.check_fail()
    
    def draw_elements(self):
        self.dot.draw_dot()
        self.snake.draw_snake()

    def check_collusion(self):
       if self.dot.pos == self.snake.body[0]:
          # verplaats de bol 
          self.dot.randomize()
          # maak slang langer
          self.snake.add_block()
    
    def check_fail(self):
      #om te zien of de snake buite et scherm is
      if not 0 <= self.snake.body[0].x < cell_number or not 0 <= self.snake.body[0].y < cell_number:
          self.game_over()
      
      #als de snake zichzelf aanraakt
      for block in self.snake.body[1:]:
         if block == self.snake.body[0]:
            self.game_over()
      

    def game_over(self):
        pygame.quit()
        sys.exit()
       

pygame.init()
cell_size = 30
cell_number= 25
width = cell_number*cell_size
heigt = cell_number*cell_size
screen =  pygame.display.set_mode((width,heigt))
clock = pygame.time.Clock()
test_surface = pygame.Surface((100,200))
background = pygame.image.load("images/background.jpg")
background = pygame.transform.scale(background, (width, heigt))

SCREEN_UPDATE = pygame.USEREVENT
pygame.time.set_timer(SCREEN_UPDATE,150)

main = MAIN()

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        if event.type == SCREEN_UPDATE:
           main.update()
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_UP:
              main.snake.direction = Vector2(0,-1)
            if event.key == pygame.K_DOWN:
              main.snake.direction = Vector2(0,1)
            if event.key == pygame.K_RIGHT:
              main.snake.direction = Vector2(1,0)
            if event.key == pygame.K_LEFT:
              main.snake.direction = Vector2(-1,0)

    screen.blit(background, (0,0))
    main.draw_elements()
    pygame.display.update()
    #hoe snel het spel loopt (framerate)
    clock.tick(60)