import pygame
import sys
import random
import colorsys
import json, os
from pygame.math import Vector2
import pygame.joystick

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('./snake-game-48a68-firebase-adminsdk-vqv8q-aa933bd31d.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

pygame.init()
pygame.joystick.init()

joysticks = []
for i in range(pygame.joystick.get_count()):
    joysticks.append(pygame.joystick.Joystick(i))
for joystick in joysticks:
    joystick.init()

with open(os.path.join("ps4_keys.json"), 'r+') as file:
    button_keys = json.load(file)
# 0: Left analog horizonal, 1: Left Analog Vertical, 2: Right Analog Horizontal
# 3: Right Analog Vertical 4: Left Trigger, 5: Right Trigger
analog_keys = {0:0, 1:0, 2:0, 3:0, 4:-1, 5: -1 }
joystick_state = {0: 0, 1: 0, 2: 0, 3: 0}

final_score = 0
class SNAKE:
    def __init__(self, start_pos):
        self.body = [start_pos, Vector2(start_pos.x - 1, start_pos.y), Vector2(start_pos.x - 2, start_pos.y)]
        self.direction = Vector2(1, 0)
        self.new_block = False

        self.head = pygame.image.load('Snakes/snake_hooft_blauw.png').convert_alpha()
        self.head_rotation = 0

        self.tail = pygame.image.load('Snakes/snake_poep_blauw.png').convert_alpha()
        self.tail_rotation = 0

        self.body_vertical = pygame.image.load('Snakes/snake_lichaam_blauw.png').convert_alpha()
        self.body_rotation = 0

        self.body_bl = pygame.image.load('Snakes/snake_boog_bl_blauw.png').convert_alpha()
        self.body_br = pygame.image.load('Snakes/snake_boog_br_blauw.png').convert_alpha()
        self.body_ol = pygame.image.load('Snakes/snake_boog_ol_blauw.png').convert_alpha()
        self.body_or = pygame.image.load('Snakes/snake_boog_or_blauw.png').convert_alpha()

    def draw_snake(self):
        self.update_head_graphics()
        self.update_tail_graphics()

        for index, block in enumerate(self.body):
            x_pos = int(block.x * cell_size)
            y_pos = int(block.y * cell_size)
            block_rect = pygame.Rect(x_pos, y_pos, cell_size, cell_size)

            if index == 0:
                rotated_head = pygame.transform.rotate(self.head, self.head_rotation)
                screen.blit(rotated_head, block_rect)
            elif index == len(self.body) - 1:
                rotated_tail = pygame.transform.rotate(self.tail, self.tail_rotation)
                screen.blit(rotated_tail, block_rect)
            else:
                previous_block = self.body[index + 1] - block
                next_block = self.body[index - 1] - block
                if previous_block.x == next_block.x:
                    screen.blit(self.body_vertical, block_rect)
                elif previous_block.y == next_block.y:
                    screen.blit(self.body_vertical, block_rect)
                else:
                    if previous_block.x == -1 and next_block.y == -1 or previous_block.y == -1 and next_block.x == -1:
                        screen.blit(self.body_ol, block_rect)
                    elif previous_block.x == -1 and next_block.y == 1 or previous_block.y == 1 and next_block.x == -1:
                        screen.blit(self.body_br, block_rect)
                    elif previous_block.x == 1 and next_block.y == -1 or previous_block.y == -1 and next_block.x == 1:
                        screen.blit(self.body_or, block_rect)
                    elif previous_block.x == 1 and next_block.y == 1 or previous_block.y == 1 and next_block.x == 1:
                        screen.blit(self.body_bl, block_rect)


    def update_head_graphics(self):
        head_relation = self.body[1] - self.body[0]
        if head_relation == Vector2(1, 0):
            self.head_rotation = 90
        elif head_relation == Vector2(-1, 0):
            self.head_rotation = 270
        elif head_relation == Vector2(0, 1):
            self.head_rotation = 0
        elif head_relation == Vector2(0, -1):
            self.head_rotation = 180

    def update_tail_graphics(self):
        tail_relation = self.body[-2] - self.body[-1]
        if tail_relation == Vector2(1, 0):
            self.tail_rotation = 90
        elif tail_relation == Vector2(-1, 0):
            self.tail_rotation = 270
        elif tail_relation == Vector2(0, 1):
            self.tail_rotation = 0
        elif tail_relation == Vector2(0, -1):
            self.tail_rotation = 180

    def move_snake(self):
        if self.new_block:
            body_copy = self.body[:]
            body_copy.insert(0, body_copy[0] + self.direction)
            self.body = body_copy[:]
            self.new_block = False
        else:
            body_copy = self.body[:-1]
            body_copy.insert(0, body_copy[0] + self.direction)
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
        brightness = random.uniform(0.5, 1.0)  # Increased brightness
        rgb_color = colorsys.hsv_to_rgb(hue, saturation, brightness)
        self.color = tuple(int(c * 255) for c in rgb_color)



class MAIN:
    def __init__(self):
      self.snake = SNAKE(Vector2(5, 10))
      self.dot = DOT()

    def update(self):
       self.snake.move_snake()
       self.check_collusion()
       self.check_fail()
    
    def draw_elements(self):
        self.dot.draw_dot()
        self.snake.draw_snake()
        self.draw_score()
        

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
        global final_score
        final_score = len(self.snake.body) - 3
        print (final_score)
         # Get a reference to the 'scores' collection in Firestore
        scores_ref = db.collection('highscores')

        # Create a new document with the final score
        score_data = {
        'name': 'John Doe',
        'score': final_score  # Use the updated score variable
        }
        scores_ref.add(score_data)
        pygame.quit()
        sys.exit()
        
        
    def draw_grass(self):
        grass_color = (43,43,48)
        for row in range(cell_number):
            if row % 2 == 0:
                for col in range(cell_number):
                    if col % 2 == 0:
                        grass_rect = pygame.Rect(col * cell_size, row * cell_size,cell_size,cell_size)
                        pygame.draw.rect(screen,grass_color,grass_rect)
            else:
                for col in range(cell_number):
                    if col % 2 != 0:
                       grass_rect = pygame.Rect(col * cell_size, row * cell_size,cell_size,cell_size)
                       pygame.draw.rect(screen,grass_color,grass_rect)
        
        
        
    def draw_score(self):
        score_text = str(len(self.snake.body) - 3)
        score_surface = game_font.render(score_text,True, (255,0,0))
       # Added white background box for the score
        box_width = 80
        box_height = 40
        box_x = int(cell_size * cell_number - box_width - 10)
        box_y = int(cell_size * cell_number - box_height - 10)
        box_rect = pygame.Rect(box_x, box_y, box_width, box_height)
        pygame.draw.rect(screen, (255, 255, 255), box_rect)
        pygame.draw.rect(screen,(255, 255, 255), box_rect, 2)
       # Position the score text within the box
        score_rect = score_surface.get_rect(center=(box_x + box_width // 2, box_y + box_height // 2))
        screen.blit(score_surface,score_rect)
       

pygame.init()
cell_size = 30
cell_number= 25
width = cell_number*cell_size
height = cell_number*cell_size
screen =  pygame.display.set_mode((width,height))
clock = pygame.time.Clock()

test_surface = pygame.Surface((100,200))
# Removed background because it is too pixely 
background_color = (139, 139, 151)
game_font = pygame.font.Font(None, 45)

SCREEN_UPDATE = pygame.USEREVENT
pygame.time.set_timer(SCREEN_UPDATE,150) 

main = MAIN()
# controller = MyController(interface="/dev/input/js0", connecting_using_ds4drv=False, event_definition=MyEventDefinition)
# controller.listen()


while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        if event.type == SCREEN_UPDATE:
            main.update()

        # Keyboard events
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_UP:
                if main.snake.direction.y != 1:
                    main.snake.direction = Vector2(0, -1)
            if event.key == pygame.K_DOWN:
                if main.snake.direction.y != -1:
                    main.snake.direction = Vector2(0, 1)
            if event.key == pygame.K_RIGHT:
                if main.snake.direction.x != -1:
                    main.snake.direction = Vector2(1, 0)
            if event.key == pygame.K_LEFT:
                if main.snake.direction.x != 1:
                    main.snake.direction = Vector2(-1, 0)

        if event.type == pygame.JOYAXISMOTION:
            # Update the joystick state when axes are moved
            if event.axis == 0:
                joystick_state[0] = event.value
            if event.axis == 1:
                joystick_state[1] = event.value

    # Update the direction of snake2 based on the joystick state
            if joystick_state[0] < -0.5 and abs(joystick_state[1]) < 0.5:
                main.snake2.direction = Vector2(-1, 0)  # Left
            elif joystick_state[0] > 0.5 and abs(joystick_state[1]) < 0.5:
                main.snake2.direction = Vector2(1, 0)  # Right
            elif abs(joystick_state[0]) < 0.5 and joystick_state[1] < -0.5:
                main.snake2.direction = Vector2(0, -1)  # Up
            elif abs(joystick_state[0]) < 0.5 and joystick_state[1] > 0.5:
                main.snake2.direction = Vector2(0, 1)  # Down

    # screen.blit(background, (0, 0))
    screen.fill(background_color)
    main.draw_grass()
    main.draw_elements()
    pygame.display.update()
    clock.tick(10)

    
    

