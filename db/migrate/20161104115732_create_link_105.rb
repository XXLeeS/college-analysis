class CreateLink105 < ActiveRecord::Migration
  def change
    create_table :link_105, id: false, force: :cascade do |t|
    	t.string "source"
    	t.string "target"
    	t.integer "value"
    end
  end
end
