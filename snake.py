import pygame
import sys
import random
import colorsys
from pygame.math import Vector2

class SNAKE:
    def __init__(self):
        self.body = [Vector2(5, 10), Vector2(4, 10), Vector2(3, 10)]
        self.direction = Vector2(1, 0)
        self.new_block = False

        self.head_up = pygame.image.load('Graphics/head_up.png').convert_alpha()
        self.head_down = pygame.image.load('Graphics/head_down.png').convert_alpha()
        self.head_right = pygame.image.load('Graphics/head_right.png').convert_alpha()
        self.head_left = pygame.image.load('Graphics/head_left.png').convert_alpha()

        self.tail_up = pygame.image.load('Graphics/tail_up.png').convert_alpha()
        self.tail_down = pygame.image.load('Graphics/tail_down.png').convert_alpha()
        self.tail_right = pygame.image.load('Graphics/tail_right.png').convert_alpha()
        self.tail_left = pygame.image.load('Graphics/tail_left.png').convert_alpha()

        self.body_vertical = pygame.image.load('Graphics/body_vertical.png').convert_alpha()
        self.body_horizontal = pygame.image.load('Graphics/body_horizontal.png').convert_alpha()

        self.body_tr = pygame.image.load('Graphics/body_tr.png').convert_alpha()
        self.body_tl = pygame.image.load('Graphics/body_tl.png').convert_alpha()
        self.body_br = pygame.image.load('Graphics/body_br.png').convert_alpha()
        self.body_bl = pygame.image.load('Graphics/body_bl.png').convert_alpha()

    def draw_snake(self):
        self.update_head_graphics()
        self.update_tail_graphics()

        for index,block in enumerate(self.body):
             # 1. A rect for the poistioning
             x_pos = int(block.x * cell_size)
             y_pos = int(block.y * cell_size)
             block_rect = pygame.Rect(x_pos,y_pos,cell_size,cell_size)

             # 2. what direction is the face heading
             if index == 0:
                   screen.blit(self.head,block_rect)
             elif index == len(self.body) - 1:
                  screen.blit(self.tail,block_rect)
             else: 
                 previous_block = self.body[index + 1] - block
                 next_block = self.body[index - 1] - block
                 if previous_block.x == next_block.x:
                    screen.blit(self.body_vertical,block_rect)
                 elif previous_block.y == next_block.y:
                    screen.blit(self.body_horizontal,block_rect)
                 else:
                    if previous_block.x == -1 and next_block.y == -1 or previous_block.y == -1 and next_block.x == -1:
                     screen.blit(self.body_tl,block_rect)
                    elif previous_block.x == -1 and next_block.y == 1 or previous_block.y == 1 and next_block.x == -1:
                     screen.blit(self.body_bl,block_rect)
                    elif previous_block.x == 1 and next_block.y == -1 or previous_block.y == -1 and next_block.x == 1:
                     screen.blit(self.body_tr,block_rect)
                    elif previous_block.x == 1 and next_block.y == 1 or previous_block.y == 1 and next_block.x == 1:
                     screen.blit(self.body_br,block_rect)
                     
                   
                     
                 
            
            
                 
                 
            
        
    def update_head_graphics(self):
        head_relation = self.body[1] - self.body[0]
        if head_relation == Vector2(1,0): self.head = self.head_left
        elif head_relation == Vector2(-1,0): self.head = self.head_right
        elif head_relation == Vector2(0,1): self.head = self.head_up
        elif head_relation == Vector2(0,-1): self.head = self.head_down

    def update_tail_graphics(self):
        tail_relation = self.body[-2] - self.body[-1]
        if tail_relation == Vector2(1,0): self.tail = self.tail_left
        elif tail_relation == Vector2(-1,0): self.tail = self.tail_right
        elif tail_relation == Vector2(0,1): self.tail = self.tail_up
        elif tail_relation == Vector2(0,-1): self.tail = self.tail_down
            
      #error with snake tail 

      
    
      #for block in self.body:
       #  x_position = int(block.x*cell_size)
        # y_position = int(block.y*cell_size)
        # block_rect = pygame.Rect(x_position, y_position,cell_size,cell_size)
        # pygame.draw.rect(screen,(92,128,27),block_rect)

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
       dot_center = (int(self.pos.x * cell_size + cell_size // 2), int(self.pos.y * cell_size + cell_size // 2))
       dot_radius = cell_size // 2
       pygame.draw.circle(screen, self.color, dot_center, dot_radius)  

    def randomize(self):
        #random plaats dot
        self.x = random.randint(0, cell_number - 1)
        self.y = random.randint(0, cell_number - 1)
        self.pos = pygame.math.Vector2(self.x, self.y)

        # Randomize dot color
        hue = random.random()  # Random hue value between 0 and 1
        saturation = random.uniform(0.8, 1.0)  # Increased saturation
        brightness = random.uniform(0.8, 1.0)  # Increased brightness
        rgb_color = colorsys.hsv_to_rgb(hue, saturation, brightness)
        self.color = tuple(int(c * 255) for c in rgb_color)

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
                if main.snake.direction.y != 1: 
                   main.snake.direction = Vector2(0,-1)
            if event.key == pygame.K_DOWN:
                if main.snake.direction.y != -1: 
                   main.snake.direction = Vector2(0,1)
            if event.key == pygame.K_RIGHT:
                if main.snake.direction.x != -1: 
                   main.snake.direction = Vector2(1,0)
            if event.key == pygame.K_LEFT:
                if main.snake.direction.x != 1: 
                   main.snake.direction = Vector2(-1,0)

    screen.blit(background, (0,0))
    main.draw_elements()
    pygame.display.update()
    #hoe snel het spel loopt (framerate)
    clock.tick(60)