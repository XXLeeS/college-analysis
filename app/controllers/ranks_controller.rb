class RanksController < ApplicationController
	before_action :set_year, :get_fields

	def index
		@departments = @dep.all.order(:ts_rscore).reverse
	end

	def show
		@this_field = params[:id].to_i
		if @this_field == 0
			@departments = @dep.all.order(:ts_rscore).reverse
		else
			@departments = @dep.where('field = (?)', @this_field).order(:ts_rscore).reverse
		end

		@rscore_mean = @departments.map(&:ts_rscore).inject(0, &:+) / @departments.length
	end

	private

	def set_year
		@year = params[:year]
		@dep = Dep.where('year = (?)', @year)
	end

	def get_fields
		@fields = {
			0 => "全部領域",
			1 => "教育領域",
			2 => "人文及藝術領域",
			3 => "社會科學、商業及法律領域",
			4 => "科學領域",
			5 => "工程、製造及營造領域",
			6 => "農學領域",
			7 => "醫藥衛生及社福領域",
			8 => "服務領域",
			9 => "其他"
		}
	end
end
