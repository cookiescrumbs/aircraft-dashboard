# Add drag and drop to Capybara that enabled draggin by offset
# Usage:
# drag_by(right_by, down_by)
# find(".ui-slider-handle").drag_by(-50, 0)
# find(".ui-slider-handle").drag_by(50, 0)

module CapybaraExtension
    def drag_by(right_by, down_by)
      base.drag_by(right_by, down_by)
    end
  end

module CapybaraSeleniumExtension
    def drag_by(right_by, down_by)
        driver.browser.action.drag_and_drop_by(native, right_by, down_by).perform
    end
end

::Capybara::Selenium::Node.send :include, CapybaraSeleniumExtension
::Capybara::Node::Element.send :include, CapybaraExtension