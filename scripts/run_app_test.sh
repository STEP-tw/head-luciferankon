./app_test_data/app_test.sh > .actual_out
diff .actual_out ./app_test_data/expected_out > state
message="test failed"
if [ echo $state ]; then
  message="test passed"
fi
echo $message
rm state
