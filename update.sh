
for Y in {2023..2023}
do
  for M in {7..7}
  do
    for D in {1..15}
    do
      for i in {01..12}
      do
        echo "$i on $M/$D/$Y"
        export GIT_COMMITTER_DATE="$Y-$M-$D 12:$i:00"
        export GIT_AUTHOR_DATE="$Y-$M-$D 12:$i:00"
        git add . -f
        git commit --date="$Y-$M-$D 12:0$i:00" -m "$i on $M $D $Y"
      done
    done
  done
done
git push origin main
git commit -am "Cleanup"
git push origin main