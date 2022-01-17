FUNCPREFIX='pcn-qms-service'

if [ $1 == 'true' ]
then
  flag='Active'
else
  flag='PassThrough'
fi

stage=`jq -r '.stage' ./resources/env.json`

funcNames=( \
  getServices
  setServices
  updateServices
  removeServices
  fetchServices
  getServiceTypes
  getRequests
  setRequest
  alarmInvoke
  updateRequest
  fetchRequests
  removeRequests
  handleMessage
  handleEvents
)

echo 'Action: ' $flag
echo 'Stage' $stage
echo 'Target Functions' ${funcNames[@]}

for name in "${funcNames[@]}"; do
  echo set $name $flag
  aws lambda update-function-configuration --function-name ${FUNCPREFIX}-${stage}-${name} --tracing-config Mode=${flag} > /dev/null &
done

for job in `jobs -p`; do wait ${job}; done

exit 1
