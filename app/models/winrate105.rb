class Winrate105 < ActiveRecord::Base
	self.table_name = "winrate_105"
	# attr_accessor :dep_name
	def dep_name
		Dep105.find(self.dep).name
	end

	def opponent_name
		Dep105.find(self.opponent).name
	end
end