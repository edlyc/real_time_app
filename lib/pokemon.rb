class Pokemon
  attr_reader :name, :max_health, :health, :attack_stat

  def initialize(attributes = {})
    @name = attributes[:name]
    @max_health = attributes[:max_health]
    @health = @max_health
    @attack_stat = attributes[:attack_stat]
  end

  def attack
    hit_roll = rand(20)
    
    # 5% chance to miss attack
    # 5% chance to do double damage
    # Most of the time, deals between 75 and 100% damage
    case hit_roll
    when 0
      return 0
    when 19
      return attack_stat * 2
    else
      damage = attack_stat * (0.75 + rand() * 0.25)
      return damage.to_i
    end
  end

  def receive_damage(damage)
    @health -= damage > @health ? @health : damage
  end
end