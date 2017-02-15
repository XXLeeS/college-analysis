class Winrate < ActiveRecord::Base
	self.table_name = "winrates"
	# attr_accessor :dep_name
	def dep_name
		Dep.find_by(dep_no: self.dep).name
	end

	def opponent_name
		Dep.find_by(dep_no: self.opponent).name
	end

	def rate_percentage
		self.win_rate * 100
	end

	belongs_to :dep
end