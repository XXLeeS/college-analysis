dep_array = @adj_dep.select do |e|
	e[:value] >= 5
end

other_sum = @student_sum - dep_array.map{|d| d[:value]}.sum
dep_array.push({:dep_no => '', :name => '其他', :value => other_sum})

dep_array.sort_by!{|d| d[:value]}.reverse!

json.adj_dep dep_array do |d|
	json.dep_no d[:dep_no]
	json.name d[:name]
	json.value d[:value]
	json.percentage ((d[:value]*100.to_f / @student_sum)).round(1)
end